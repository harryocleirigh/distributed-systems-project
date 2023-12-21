import hashlib
from datetime import datetime
import json
from flask_cors import CORS

from flask import Flask, request, jsonify
import redis

app = Flask(__name__)
CORS(app)
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)

@app.route('/calculate_credit_score', methods=['POST'])
def calculate_credit_score():
    try:
        data = request.get_json()

        user_id = generate_user_id(data['name'], data['dob'])

        # check if user is in cache
        cached_data = redis_client.get(user_id)

        if cached_data:
            cached_data = json.loads(cached_data)
            
            # cached data will have credit score, have to remove for comparison
            cached_data_without_credit_score = cached_data.copy()
            cached_data_without_credit_score.pop('credit_score', None)

            # JSON sent is the same as cached
            if cached_data_without_credit_score == data:
                print("Using cache")
                return jsonify({'username': data['name'], 'creditScore': cached_data['credit_score']})

        print("NOT in cache")
        credit_score = calculate_score(data)

        # Store the entire JSON object in the cache
        data['credit_score'] = credit_score
        redis_client.set(user_id, json.dumps(data))
        redis_client.expire(user_id, 3600)

        # just credit score
        return jsonify({'creditScore': credit_score})

    except Exception as e:
        return jsonify({'error': str(e)})

def calculate_score(data):
    dob_date = datetime.strptime(data['dob'], '%Y-%m-%d')
    today = datetime.now()
    age = today.year - dob_date.year - ((today.month, today.day) < (dob_date.month, dob_date.day))

    base_score = 700
    age_factor = max(0, min(100, (age - 25) * 5))

    payment_history = data['missedPaymentsFrequency'].lower()

    payment_history_factors = {
        'never': 0,
        'rarely': -20,
        'sometimes': -40,
        'often': -60,
        'always': -80,
    }

    payment_history_factor = payment_history_factors.get(payment_history, -50)

    credit_utilization_factor = max(-30, min(30, data['creditUtilisation'] - 20))
    credit_history_factor = max(0, min(50, data['creditUseLength'] - 2 * 10))
    debt_to_income_ratio_factor = max(-30, min(30, data['debtToIncomeRatio'] - 20))

    # Incorporate newCredit into the calculation
    new_credit_factor = -50 if data['newCredit'].lower() == 'yes' else 0

    total_score = base_score + age_factor + payment_history_factor + credit_utilization_factor + \
        credit_history_factor + debt_to_income_ratio_factor + new_credit_factor

    return max(200, min(1000, total_score))


def generate_user_id(name, dob):
    user_data = f"{name.lower()}{dob.lower()}"
    hashed_user_id = hashlib.sha256(user_data.encode()).hexdigest()
    return hashed_user_id

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

# loan type, loan value, loan term length