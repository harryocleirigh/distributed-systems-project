from datetime import datetime
import json
from flask_cors import CORS
from flask import Flask, request, jsonify

app = Flask(__name__)

def calculate_repayment(loan_amount, term_length, interest_rate):
    print(f"Calculating repayment: Loan Amount={loan_amount}, Term Length={term_length}, Interest Rate={interest_rate}")
    total_repayment = loan_amount * (1 + interest_rate * term_length)
    monthly_repayment = total_repayment / (term_length * 12)
    print(f"Total Repayment={total_repayment}, Monthly Repayment={monthly_repayment}")
    return total_repayment, monthly_repayment

def get_bank_offers(credit_score, loan_amount, term_length):
    banks = {
        "Bank of Books": {750: 0.05, 650: 0.07, 0: 0.10},
        "Bank of Edu-mate": {750: 0.04, 650: 0.06, 0: 0.09},
        "Students R Us": {750: 0.06, 650: 0.08, 0: 0.11}
    }

    offers = []
    for bank, rates in banks.items():
        for score_threshold, rate in sorted(rates.items(), reverse=True):
            if credit_score >= score_threshold:
                print(f"Bank: {bank}, Credit Score: {credit_score}, Selected Rate: {rate}")
                total_repayment, monthly_repayment = calculate_repayment(loan_amount, term_length, rate)
                offer = {
                    "bank": bank,
                    "interest_rate": rate,
                    "total_repayment_amount": total_repayment,
                    "monthly_repayment_amount": monthly_repayment
                }
                offers.append(offer)
                break
    print(f"Generated Offers: {offers}")
    return offers

@app.route('/process_loan', methods=['POST'])
def process_loan():
    data = request.json
    print(f"Received Data: {data}")

    loan_amount = data.get('loanAmount')
    term_length = data.get('loanTermLength')
    credit_score = data.get('creditScore')

    # Error handling for missing data
    if loan_amount is None or term_length is None or credit_score is None:
        return jsonify({"error": "Missing loanAmount, loanTermLength, or creditScore in the request"}), 400

    loan_offers = get_bank_offers(credit_score, loan_amount, term_length)
    response = {
        "original_data": data,
        "loan_offers": loan_offers
    }
    return jsonify(response)


if __name__ == '__main__':
    print("Starting Student Loan Service...")
    app.run(debug=True, host='0.0.0.0', port=5001)


# Sample Request to run in second terminal window:
# curl -X POST -H "Content-Type: application/json" -d '{
#   "name": "John Doe",
#   "dob": "1990-01-01",
#   "loanType": "student",
#   "loanAmount": 500000,
#   "loanTermLength": 30,
#   "creditScore": 720,
#   "employmentStatus": "employed",
#   "industry": "tech",
#   "annualIncome": 100000,
#   "missedPaymentsFrequency": "never",
#   "creditUtilisation": 30,
#   "creditUseLength": 10,
#   "newCredit": "no",
#   "creditAccounts": {
#     "creditCards": true,
#     "mortgages": false,
#     "studentLoans": true,
#     "autoLoans": false
#   },
#   "debtToIncomeRatio": 0.3,
#   "currentDebt": 20000
# }' http://localhost:5001/process_loan
