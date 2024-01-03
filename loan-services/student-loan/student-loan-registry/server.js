// Service Registry for Personal Loan service cluster
// Responsible for maintaining a list of providers by using Eurkea.
// Listens to the 'personal-loan' rabbit messaging queue for client requests
// Sends loan offer to the gateway's 'offers-queue' for handling

const express = require('express');
const cors = require('cors'); 
const axios = require('axios');
const app = express();

const produce = require('./rabbitmq/producer');
const consume = require('./rabbitmq/consumer');
const client = require('./middleware/client')

app.use(cors());
app.use(express.json());
const port = 6000;

// Start the student-loan discovery server
client.start(error => {
  console.log(error || 'Eureka registration complete');
});

/**
 * Consumer for handling messages sent to the student-loan messaging queue
 * Recieved a message as input (client-info) and relays this to all services attached to
 * The Eureka student-loan discovery server
 * 
 * If successful responses are received, produce a message to the gateway's offers queue.
 * This message is the combined loan offers of all attached services.
 */
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

// Start The Registry Service
app.listen(port, () => {
  console.log(`Service registry listening at http://student-loan-registry:${port}`);
});