const axios = require('axios');
const determineServiceProvider = require('../middleware/determineServiceProvider')
const produce = require('../middleware/rabbitmq/producer');
const consume = require('../middleware/rabbitmq/consumer'); 

/**
 * 
 * Responsible for submitting client information to the credit score calculator
 * Waits for a credit score for a given user.
 * Sends client info & credit score to the relevant loan service provider
 * 
 * Responds with the service providers loan offers
 * 
 * @param {*} req 
 * @param {*} res 
 */

const submit = async (req, res) => {
    try {
        const calculatorResponse = await axios.post('http://calculator:5000/calculate_credit_score', req.body);
        console.log('Calculator response:', calculatorResponse.data);

        // spread operator to combine the two objects
        const completeJSONRes = { ...req.body, creditScore: calculatorResponse.data.creditScore };

        // Determine the service provider and make the request
        const serviceProviderType = determineServiceProvider(completeJSONRes);

        const updateOffers = (message) => { 
            console.log("service provider response: ", message.content.toString())
            res.json(JSON.parse(message.content.toString()))
        }

        consume("offers-queue", updateOffers)

        produce(serviceProviderType, completeJSONRes)
    
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
}

module.exports = submit