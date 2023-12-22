// Service registry for Student Loan service
const express = require('express');
const cors = require('cors'); 
const axios = require('axios');
const app = express();
app.use(cors());
app.use(express.json());
const port = 6000;

const serviceRegistry = {};
const listOfQuotes = [];

app.post('/register', (req, res) => {

    const { serviceName, serviceUrl } = req.body;
    if (!serviceName || !serviceUrl) {
        return res.status(400).send('Invalid service info');
    }

    // Register the service with the registry
    serviceRegistry[serviceName] = serviceUrl;

    res.json({ message: 'Service registered successfully' });

    console.log(serviceRegistry);
});

app.post('/getQuotes', async (req, res) => {

    // for every service in the service registry
    for (const service in serviceRegistry) {
        const serviceUrl = serviceRegistry[service];
        const response = await axios.post(`${serviceUrl}/calculate-loan`, req.body);
        listOfQuotes.push(response.data);
    }

    console.log(listOfQuotes);

    res.json(listOfQuotes);
});

app.listen(port, () => {
    console.log(`Service registry listening at http://student-loan-registry:${port}`);
});