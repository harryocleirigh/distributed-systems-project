const Eureka = require('eureka-js-client').Eureka;
const express = require('express');
const axios = require('axios');
const app = express();
const port = 6003;

app.use(express.json());

const providerName = 'An Post';
const linkToImage = "https://pbs.twimg.com/profile_images/1675563149968252928/LZkCg_gi_400x400.jpg";

const eurekaClient = new Eureka({
  instance: { 
    app: 'PERSONAL-LOAN-SERVICES', // Use a common Eureka app ID for all related services
    instanceId: 'personal-loan-an-post', // Unique instance ID for this service
    hostName: 'personal-loan-an-post',
    ipAddr: 'personal-loan-an-post', // Adjust as needed for Docker networking
    statusPageUrl: `http://personal-loan-an-post:${port}/info`,
    healthCheckUrl: `http://personal-loan-an-post:${port}/health`,
    port: {
      '$': port,
      '@enabled': true,
    },
    vipAddress: 'personal-loan-an-post',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    }
  },
  eureka: {
    host: 'eureka-server',
    port: 8761,
    servicePath: '/eureka/apps/'
  }
});


eurekaClient.start(error => {
  if (error) {
    console.log('Eureka registration failed:', error);
  } else {
    console.log('Eureka registration complete');
  }
});

eurekaClient.on('/info', () => {
  console.log('Eureka client registered');
});

app.post('/calculate-loan', (req, res) => {

    // Parse the JSON request body
    const { loanAmount, creditScore, loanTermLength } = req.body;
    
    if (!loanAmount || !creditScore) {
        return res.status(400).send('Invalid request');
    }

    // Calculate the interest rate
    let interestRate = 0;
    
    if (creditScore < 600) {
        interestRate = 0.06;
    } else if (creditScore < 700) {
        interestRate = 0.053;
    } else {
        interestRate = 0.042;
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
    console.log(`An Post personal loan service listening at http://personal-loan-an-post:${port}`);
});