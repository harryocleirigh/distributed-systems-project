/// An Post Personal Loan Provider Service
/// Responsible for recieving a client request from the Personal Loan Registry
/// and calculating a loan offer. This loan offer is returned to the Registry via HTTP

const express = require('express');
const app = express();
const eurekaClient = require('./middleware/client')
const calculateLoan = require('./controllers/calculateLoan')
const port = 6003;

app.use(express.json());

// Register with the personal loan service discovery server
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

/// Route for handling loan requests
app.post('/calculate-loan', calculateLoan);

/// Start the An Post personal loan service.
app.listen(port, async () => {
    console.log(`An Post personal loan service listening at http://personal-loan-an-post:${port}`);
});