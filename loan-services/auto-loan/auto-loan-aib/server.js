const express = require('express');
const axios = require('axios');
const app = express();
const port = 6001;

app.use(express.json());

const providerName = 'Allied Irish Bank';
const linkToImage = "https://pbs.twimg.com/profile_images/1277622308715343872/TcUC4R0S_400x400.jpg"

app.post('/calculate-loan', (req, res) => {

    // Parse the JSON request body
    const { loanAmount, creditScore, loanTermLength } = req.body;
    
    if (!loanAmount || !creditScore) {
        return res.status(400).send('Invalid request');
    }

    // Calculate the interest rate
    let interestRate = 0;
    
    if (creditScore < 600) {
        interestRate = 0.1;
    } else if (creditScore < 700) {
        interestRate = 0.08;
    } else {
        interestRate = 0.05;
    }

    // Calculate the monthly payment
    const monthlyPayment = (loanAmount * (interestRate + 1)) / loanTermLength;
    const totalPayment = monthlyPayment * loanTermLength;

    console.log('Interest rate:', interestRate);
    console.log('Interest rate:', monthlyPayment);

    // Prepare the response body
    const responseBody = {
        providerName,
        linkToImage,
        totalPayment,
        monthlyPayment,
        interestRate
    };

    // Send the response
    res.json(responseBody);

    // Log the request
    console.log('Received request to calculate loan');
    console.log('Request body:', req.body);
    console.log('Response body:', responseBody);
    
});

app.listen(port, async () => {
    
    console.log(`AIB Auto loan service listening at http://auto-loan-aib:${port}`);

    // Register with the control server
    try {
        const res = await axios.post('http://auto-loan-registry:6000/register', {
            serviceName: 'auto-loan-aib',
            // serviceUrl: `http://autoloan-aib:${port}`
            serviceUrl: `http://auto-loan-aib:${port}`
        });
        console.log(res.data);
    } catch (err) {
        console.error('Failed to register with control server:', err.message);
    }
});