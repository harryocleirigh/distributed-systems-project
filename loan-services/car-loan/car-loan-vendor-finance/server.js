/// Vendor Finance Car Loan Provider Service
/// Responsible for recieving a client request from the Car Loan Registry
/// and calculating a loan offer. This loan offer is returned to the Registry via HTTP

const express = require('express');
const app = express();
const eurekaClient = require('./middleware/client')
const calculateLoan = require('./controllers/calculateLoan')
const port = 6003;

app.use(express.json());

// Register with the car loan service discovery server
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

// Route to handle loan requests
app.post('/calculate-loan', calculateLoan);

/// Start the Vendor Finance car loan service.
app.listen(port, async () => {
    console.log(`Vendor Finance car loan service listening at http://car-loan-vendor-finance:${port}`);
});