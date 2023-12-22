import hashlib
from datetime import datetime
import json
from flask_cors import CORS
from flask import Flask, request, jsonify
import redis
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

# connect to redis
# redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)
redis_client = redis.StrictRedis(host='redis', port=6379, db=0, decode_responses=True)

# connect to MongoDB
# mongo_client = MongoClient('mongodb://localhost:27017/')
mongo_client = MongoClient('mongodb://mongodb:27017/')

# connect to database credit_scores_db - if it does not exist it will create it
mongodb = mongo_client['credit_scores_db']

# create collection (table) credit_scores - if it does not exist it will create it
collection = mongodb['credit_scores']

@app.route('/calculate_credit_score', methods=['POST'])
def calculate_credit_score():
    try:
        data = request.get_json()
        print("Received data")
        print(data)
        # print(" ")
        
        user_id = generate_user_id(data['name'], data['dob'])
        print(f"Generated user_id: {user_id}")

        # check if user is in Redis cache
        cached_data = redis_client.get(user_id)

        if cached_data:
            cached_data = json.loads(cached_data)
            
            # cached data will have credit score, have to remove for comparison
            cached_data_without_credit_score = cached_data.copy()
            cached_data_without_credit_score.pop('credit_score', None)

            # JSON sent is the same as cached
            if cached_data_without_credit_score == data:
                    response_data = {'creditScore': cached_data['credit_score']}
                    # print("cached data without credit score", cached_data_without_credit_score)
                    # print("received data", data)
                    print("************")
                    print("In cache. Credit score: ", cached_data['credit_score'])
                    print("************")
                    # print("*************")
                    # print(response_data)
                    # print("*************")
                    return jsonify(response_data)
            
        print("************")
        print("NOT in cache")
        print("************")
        credit_score = calculate_score(data)
    
        # Store the entire JSON object in Redis and MongoDB
        data['credit_score'] = credit_score


        try: 
            # Check if user is in MongoDB
            mongodb_data = collection.find_one({'_id': user_id})
            print(f'checking if user_id: {user_id} is in MongoDB')
            
            if mongodb_data:
                print(f"Updating the following to mongoDB id: {user_id}")
                collection.update_one({'_id': user_id}, {'$set': data})
            else:
                # Add a new item to MongoDB
                data['_id'] = user_id
                print(f"setting key: {data['_id']}")
                print(f"Adding the following to mongoDB id: {user_id}")
                collection.insert_one(data)

            print(f"Number of documents in the collection: {collection.count_documents({})}")
        except Exception as e:
            print(f"Error in MongoDB operations: {e}")

        # Update or add item in Redis cache
        redis_client.set(user_id, json.dumps(data))
        redis_client.expire(user_id, 3600)

        # just credit score
        print("*************")
        print(f"not in cache, credit_score {credit_score}")
        print("*************")
        return jsonify({'creditScore': credit_score})
    
    except Exception as e:
        return jsonify({'error': str(e)})
    
# New endpoint to retrieve all data from MongoDB
@app.route('/get_all_data', methods=['GET'])
def get_all_data():
    try:
        all_data = list(collection.find({}, {'_id': 0}))

        for data in all_data:
            if '_id' in data:
                data['_id'] = str(data['_id'])

        return jsonify(all_data)

    except Exception as e:
        return jsonify({'error': str(e)})

def calculate_score(data):
    print("Calculating credit score…")
    dob_date = datetime.strptime(data['dob'], '%Y-%m-%d')
    today = datetime.now()
    age = today.year - dob_date.year - ((today.month, today.day) < (dob_date.month, dob_date.day))
    print("Age: ", age)

    # set base credit score of 600
    base_score = 600

    # reward being older (over 25) - linear rewards
    age_factor = max(0, min(100, (age - 25) * 5))

    payment_history = data['missedPaymentsFrequency'].lower()
    print("missedPaymentsFrequency: ", payment_history)
    payment_history_factors = {
        'never': 0,
        'rarely': -20,
        'sometimes': -40,
        'often': -60,
        'always': -80,
    }

    # penalisation for missing payments
    payment_history_factor = payment_history_factors.get(payment_history)

    credit_utilisation = int(data['creditUtilisation'])
    credit_use_length = int(data['creditUseLength'])
    debt_to_income_ratio = int(data['debtToIncomeRatio'])

    # penalise higher credit utilisation (over 15)
    credit_utilisation_penalty = -credit_utilisation * 2 if credit_utilisation > 15 else 0
    # print('creditUtilisation: ', data['creditUtilisation'])
    # print("credit utilisation penalty (<15 = 0): ", credit_utilisation_penalty)

    # reward longer credit history - 5 * length of using history
    credit_history_factor = credit_use_length * 7
    # print("creditUseLength: ", data['creditUseLength'])
    # print('credit history reward: ', credit_history_factor)

    # penalise high debt to income ratio
    debt_to_income_penalty = -debt_to_income_ratio * 3 if debt_to_income_ratio > 20 else 0
    # print("debtToIncomeRatio: ", data['debtToIncomeRatio'])
    # print('debt to income penalty (<20 = 0):', debt_to_income_penalty)

    # 50 point deduction if recently applied for credit
    new_credit_factor = -50 if data['newCredit'].lower() == 'yes' else 0
    # print("newCredit penalty: ", data['newCredit'])

    total_score = base_score + age_factor + payment_history_factor + credit_utilisation_penalty + \
        credit_history_factor + debt_to_income_penalty + new_credit_factor
    
    print("score at this stage", total_score)

    return max(200, min(1000, total_score))

# generate hash for key in redis - hash of name and age
def generate_user_id(name, dob):
    user_data = f"{name.lower()}{dob.lower()}"
    hashed_user_id = hashlib.sha256(user_data.encode()).hexdigest()
    return hashed_user_id

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
