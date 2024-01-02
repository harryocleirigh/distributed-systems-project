// Service registry for Car Loan service cluster
const Eureka = require('eureka-js-client').Eureka;
const express = require('express');
const cors = require('cors'); 
const axios = require('axios');
const app = express();
const produce = require('./rabbitmq/producer');
const consume = require('./rabbitmq/consumer');
app.use(cors());
app.use(express.json());
const port = 6000;

// const serviceRegistry = {};
// const listOfQuotes = [];

const client = new Eureka({
  instance: {
    app: 'car-loan-registry',
    hostName: 'car-loan-registry',
    ipAddr: 'car-loan-registry',
    statusPageUrl: `http://car-loan-registry:${port}/info`,
    healthCheckUrl: `http://car-loan-registry:${port}/health`,
    port: {
      '$': port,
      '@enabled': true,
    },
    vipAddress: 'car-loan-registry',
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

client.start(error => {
  console.log(error || 'Eureka registration complete');
});

consume('car-loan', async (message) => {
    const services = client.getInstancesByAppId('CAR-LOAN-SERVICES'); // CAR-LOAN-SERVICE is the Eureka app ID for your car loan services
    let quotes = [];

    const messageContent = JSON.parse(message.content.toString());

    for (const service of services) {
    
        const serviceUrl = `http://${service.ipAddr}:${service.port.$}/calculate-loan`;
    
        console.log(`Calling ${serviceUrl}`);
    
        try {
          const response = await axios.post(serviceUrl, messageContent);
          quotes.push(response.data);
        } catch (error) {
          console.error(`Error calling ${serviceUrl}: ${error.message}`);
        }
      }
    
    console.log("QUOTES: ", quotes)
    produce('offers-queue', JSON.stringify(quotes))
})

// app.post('/getQuotes', async (req, res) => {

//   const services = client.getInstancesByAppId('CAR-LOAN-SERVICES'); // CAR-LOAN-SERVICE is the Eureka app ID for your car loan services
//   let quotes = [];

//   for (const service of services) {
    
//     const serviceUrl = `http://${service.ipAddr}:${service.port.$}/calculate-loan`;

//     console.log(`Calling ${serviceUrl}`);

//     try {
//       const response = await axios.post(serviceUrl, req.body);
//       quotes.push(response.data);
//     } catch (error) {
//       console.error(`Error calling ${serviceUrl}: ${error.message}`);
//     }
//   }

//   res.json(quotes);
// });

app.listen(port, () => {
  console.log(`Service registry listening at http://car-loan-registry:${port}`);
});

// app.post('/register', (req, res) => {

//     const { serviceName, serviceUrl } = req.body;
//     if (!serviceName || !serviceUrl) {
//         return res.status(400).send('Invalid service info');
//     }

//     // Register the service with the registry
//     serviceRegistry[serviceName] = serviceUrl;

//     res.json({ message: 'Service registered successfully' });

//     console.log(serviceRegistry);
// });

// app.post('/getQuotes', async (req, res) => {

//     for (const service in serviceRegistry) {
//         const serviceUrl = serviceRegistry[service];
//         try {
//             const response = await axios.post(`${serviceUrl}/calculate-loan`, req.body);
//             listOfQuotes.push(response.data);
//         } catch (error) {
//             console.error(`Error calling ${serviceUrl}: ${error.message}`);
//         }
//     }

//     console.log(listOfQuotes);

//     res.json(listOfQuotes);
// });

// app.listen(port, () => {
//     console.log(`Service registry listening at http://car-loan-registry:${port}`);
// });