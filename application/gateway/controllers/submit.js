const axios = require('axios');
const determineServiceProvider = require('../middleware/determineServiceProvider')

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

        const serviceProviderResponse = await axios.post(`http://${serviceProviderType}-registry:6000/getQuotes`, completeJSONRes);
        
        console.log('Service provider response:', serviceProviderResponse.data);
        // Send the response from the service provider to the client
        res.json(serviceProviderResponse.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
}

module.exports = submit