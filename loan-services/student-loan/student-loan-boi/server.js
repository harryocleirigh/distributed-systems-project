/// AIB Student Loan Provider Service
/// Responsible for recieving a client request from the Student Loan Registry
/// and calculating a loan offer. This loan offer is returned to the Registry via HTTP

const Eureka = require('eureka-js-client').Eureka;
const express = require('express');
const app = express();
const port = 6004;

app.use(express.json());

const providerName = 'Bank Of Ireland';
const linkToImage = "https://pbs.twimg.com/profile_images/1675809938487095297/DlQNzfCA_400x400.jpg";

/**
 * Configure and Instantiate a BOI student loan Eureka Client
 */
const eurekaClient = new Eureka({
  instance: { 
    app: 'STUDENT-LOAN-SERVICES', // Use a common Eureka app ID for all related services
    instanceId: 'student-loan-boi', // Unique instance ID for this service
    hostName: 'student-loan-boi',
    ipAddr: 'student-loan-boi', // Adjust as needed for Docker networking
    statusPageUrl: `http://student-loan-boi:${port}/info`,
    healthCheckUrl: `http://student-loan-boi:${port}/health`,
    port: {
      '$': port,
      '@enabled': true,
    },
    vipAddress: 'student-loan-boi',
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

// Register with the student loan service discovery server
eurekaClient.start(error => {
  if (error) {
    console.log('Eureka registration failed:', error);
  } else {
    console.log('Eureka registration complete');
  }
});

// Notify of successful registration
eurekaClient.on('/info', () => {
  console.log('Eureka client registered');
});

/**
 * Route for calculating loan offers
 * Takes a client information object as a request
 * Retuns a loan ofer response
 * 
 * The loan offer is calculated by combing the requested loan details with
 * Client details like credit score.
 */
app.post('/calculate-loan', (req, res) => {

    // Parse the JSON request body
    const { loanAmount, creditScore, loanTermLength } = req.body;
    
    if (!loanAmount || !creditScore) {
        return res.status(400).send('Invalid request');
    }

    // Calculate the interest rate
    let interestRate = 0;
    
    if (creditScore < 600) {
        interestRate = 0.081;
    } else if (creditScore < 700) {
        interestRate = 0.078;
    } else {
        interestRate = 0.072;
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

/// Start the BOI student loan service.
app.listen(port, async () => {
    console.log(`BOI student loan service listening at http://student-loan-boi:${port}`);
});