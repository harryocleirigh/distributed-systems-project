const Eureka = require('eureka-js-client').Eureka;
const express = require('express');
const app = express();
const port = 6003;

app.use(express.json());

const providerName = 'Vendor Finance';
const linkToImage = "https://scontent-dub4-1.xx.fbcdn.net/v/t39.30808-6/302692377_499165928880375_6378380000885824443_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=efb6e6&_nc_ohc=IWrPqcTKVr0AX-pg0tS&_nc_ht=scontent-dub4-1.xx&oh=00_AfDk5BdVUteqSiDi-ilWnRVunCISib07tA3BaQmKOCj_kw&oe=65932300";

const eurekaClient = new Eureka({
  instance: { 
    app: 'HOME-LOAN-SERVICES', // Use a common Eureka app ID for all related services
    instanceId: 'home-loan-vendor-finance', // Unique instance ID for this service
    hostName: 'home-loan-vendor-finance',
    ipAddr: 'home-loan-vendor-finance', // Adjust as needed for Docker networking
    statusPageUrl: `http://home-loan-vendor-finance:${port}/info`,
    healthCheckUrl: `http://home-loan-vendor-finance:${port}/health`,
    port: {
      '$': port,
      '@enabled': true,
    },
    vipAddress: 'home-loan-vendor-finance',
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
        interestRate = 0.0777777;
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
    console.log(`Vendor finance home loan service listening at http://home-loan-vendor-finance:${port}`);
});