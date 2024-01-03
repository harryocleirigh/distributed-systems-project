// Service Registry for Home Loan service cluster
// Responsible for maintaining a list of providers by using Eurkea.
// Listens to the 'home-loan' rabbit messaging queue for client requests
// Sends loan offer to the gateway's 'offers-queue' for handling

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

/**
 * Configure and Instantiate a Eureka Client
 * Creates a home-loan eureka discovery server
 */
const client = new Eureka({
  instance: {
    app: 'home-loan-registry',
    hostName: 'home-loan-registry',
    ipAddr: 'home-loan-registry',
    statusPageUrl: `http://home-loan-registry:${port}/info`,
    healthCheckUrl: `http://home-loan-registry:${port}/health`,
    port: {
      '$': port,
      '@enabled': true,
    },
    vipAddress: 'home-loan-registry',
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

// Start the home-loan discovery server
client.start(error => {
  console.log(error || 'Eureka registration complete');
});

/**
 * Consumer for handling messages sent to the home-loan messaging queue
 * Recieved a message as input (client-info) and relays this to all services attached to
 * The Eureka home-loan discovery server
 * 
 * If successful responses are received, produce a message to the gateway's offers queue.
 * This message is the combined loan offers of all attached services.
 */
consume('home-loan', async (message) => {
    const services = client.getInstancesByAppId('HOME-LOAN-SERVICES'); // HOME-LOAN-SERVICE is the Eureka app ID for your home loan services
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

// Start The Registry Service
app.listen(port, () => {
  console.log(`Service registry listening at http://home-loan-registry:${port}`);
});