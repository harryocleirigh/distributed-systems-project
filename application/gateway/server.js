//////////////////////////////// 
//    API GATEWAY SERVER      // 
////////////////////////////////

// Responsible for handling client loan requests.
// Requests service of 'calculator' to determine clients credit score
// Requests service of loan service providers to issue loan offer(s)

// > MAIN of the Gateway server application
// > Handles the running of application, intitiation of middleware
// > Allowed routes are defined below

////////////////////////////////

const express = require('express');
const app = express();
const cors = require('cors'); 
const submit = require('./controllers/submit');
const rateLimiter = require('./middleware/rateLimiter')
const {logger, request_logger} = require("./middleware/logger")

// MIDDLEWARE:
app.use(cors());
app.use(express.json());
app.use(rateLimiter)
app.use(logger);
app.use(request_logger);

// ROUTES:
app.get('/home', (req, res) => res.send('API Gateway is running'));

app.post('/api/submit', submit)

app.get('*', (req, res) => {
    res.status(404).send("Unknown route. Please check the URL entered")
});


// START APP:
const port = 8000;
app.listen(port, () => console.log(`API Gateway listening on port ${port}!`));