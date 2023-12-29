const Eureka = require('eureka-js-client').Eureka;
const express = require('express');
const axios = require('axios');
const app = express();
const port = 6003;

app.use(express.json());

const providerName = 'Vendor Finance';
const linkToImage = "https://vendorfinance.ie/wp-content/uploads/2021/01/VendorFinance_Logo-01.svg";

const eurekaClient = new Eureka({
  instance: { 
    app: 'CAR-LOAN-SERVICES', // Use a common Eureka app ID for all related services
    instanceId: 'car-loan-vendor-finance', // Unique instance ID for this service
    hostName: 'car-loan-vendor-finance',
    ipAddr: 'car-loan-vendor-finance', // Adjust as needed for Docker networking
    statusPageUrl: `http://car-loan-vendor-finance:${port}/info`,
    healthCheckUrl: `http://car-loan-vendor-finance:${port}/health`,
    port: {
      '$': port,
      '@enabled': true,
    },
    vipAddress: 'car-loan-vendor-finance',
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
        interestRate = 0.17;
    } else if (creditScore < 700) {
        interestRate = 0.145;
    } else {
        interestRate = 0.777777;
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
    console.log(`AIB car loan service listening at http://car-loan-aib:${port}`);
});