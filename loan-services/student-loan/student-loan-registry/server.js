// Service registry for Student Loan service cluster
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
    app: 'student-loan-registry',
    hostName: 'student-loan-registry',
    ipAddr: 'student-loan-registry',
    statusPageUrl: `http://student-loan-registry:${port}/info`,
    healthCheckUrl: `http://student-loan-registry:${port}/health`,
    port: {
      '$': port,
      '@enabled': true,
    },
    vipAddress: 'student-loan-registry',
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

consume('student-loan', async (message) => {
    const services = client.getInstancesByAppId('STUDENT-LOAN-SERVICES'); // STUDENT-LOAN-SERVICE is the Eureka app ID for your student loan services
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


app.listen(port, () => {
  console.log(`Service registry listening at http://student-loan-registry:${port}`);
});