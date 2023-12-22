// Server for API Gateway

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors'); 
const axios = require('axios');

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// Middleware for logging
app.use((req, res, next) => {
    console.log(`Received request for ${req.url}`);
    next();
});

const logger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
    console.log('Body:', req.body);
    next();
};

app.use(logger);

// Proxy endpoint to Credit Score Generator
app.use('/api/submit', createProxyMiddleware({ 
    target: 'http://calculator:5000/calculate_credit_score', // URL of our flask app that will create the credit score for our user
    // target: 'http://127.0.0.1:5000/calculate_credit_score', // URL of our flask app that will create the credit score for our user
    changeOrigin: true,
    pathRewrite: { '^/api/submit': '' },
    onProxyReq: (proxyReq, req) => {
        if (req.method === 'POST' && req.body) {
            let bodyData = JSON.stringify(req.body);
            proxyReq.setHeader('Content-Type','application/json');
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
        }
    },
    onProxyRes: handleCreditResponse
}));

function handleCreditResponse(proxyRes, req, res) {
    let body = [];
    proxyRes.on('data', (chunk) => {
        body.push(chunk);
    });
    proxyRes.on('end', () => {

        body = Buffer.concat(body).toString();
        const proxiedResponse = JSON.parse(body);
        req.body.creditScore = proxiedResponse.creditScore;
        const completeJSONRes = req.body;

        // console.log("completeJSONRes:", completeJSONRes);

        const serviceProviderType = determineServiceProvider(completeJSONRes);

        // console.log(serviceProviderType)

        const serviceProviderResponse = axios.post(`http://${serviceProviderType}-registry:6000/getQuotes`, completeJSONRes)
        .then(response => {
            console.log('Response from service provider:', response.data);
            return response;
        })
        .catch(error => {
            console.error('Error during axios request:', error);
        });
    });
}

function determineServiceProvider(response) {

    console.log("Response in the determine response", response)

    if (response.loanType == 'student') {
        return 'student-loan';
    } else if (response.loanType == 'home') {
        return 'home-loan';
    } else if (response.loanType == 'auto') {
        return 'car-loan';
    } else if (response.loanType == 'personal') {
        return 'personal-loan';
    }
}



app.get('/', (req, res) => res.send('API Gateway is running'));
app.listen(port, () => console.log(`API Gateway listening on port ${port}!`));