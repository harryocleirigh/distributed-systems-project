// Server for API Gateway // 

const express = require('express');
// const { createProxyMiddleware } = require('http-proxy-middleware');
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

// // Proxy endpoint to Credit Score Generator
// app.use('/api/submit', createProxyMiddleware({ 
//     target: 'http://calculator:5000/calculate_credit_score', // URL of our flask app that will create the credit score for our user
//     // target: 'http://127.0.0.1:5000/calculate_credit_score', // URL of our flask app that will create the credit score for our user
//     changeOrigin: true,
//     pathRewrite: { '^/api/submit': '' },
//     onProxyReq: (proxyReq, req) => {
//         if (req.method === 'POST' && req.body) {
//             let bodyData = JSON.stringify(req.body);
//             proxyReq.setHeader('Content-Type','application/json');
//             proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
//             proxyReq.write(bodyData);
//         }
//     },
//     onProxyRes: handleCreditResponse
// }));

// function handleCreditResponse(proxyRes, req, res) {
//     let body = [];
//     proxyRes.on('data', (chunk) => {
//         body.push(chunk);
//     });
//     proxyRes.on('end', async () => {
//         body = Buffer.concat(body).toString();
//         const proxiedResponse = JSON.parse(body);
//         console.log('Proxied Response:', proxiedResponse);
//         req.body.creditScore = proxiedResponse.creditScore;
//         const completeJSONRes = req.body;

//         const serviceProviderType = determineServiceProvider(completeJSONRes);

//         try {
//             const serviceProviderResponse = await axios.post(`http://${serviceProviderType}-registry:6000/getQuotes`, completeJSONRes);
//             // console.log('Response from service provider:', serviceProviderResponse.data);
//             if (!res.headersSent) {
//                 console.log('Sending response to client ->', serviceProviderResponse)
//                 res.json(serviceProviderResponse.data);  // Send the response from the service provider
//             }
//         } catch (error) {
//             console.error('Error during axios request:', error);
//             if (!res.headersSent) {
//                 res.status(500).json({ error: 'An error occurred while processing your request.' });
//             }
//         }
//     });
// }

app.post('/api/submit', async (req, res) => {
    try {
        
        const calculatorResponse = await axios.post('http://calculator:5000/calculate_credit_score', req.body);
        console.log('Calculator response:', calculatorResponse.data);

        // spread operator to combine the two objects
        const completeJSONRes = { ...req.body, creditScore: calculatorResponse.data.creditScore };

        // Determine the service provider and make the request
        const serviceProviderType = determineServiceProvider(completeJSONRes);

        const serviceProviderResponse = await axios.post(`http://${serviceProviderType}-registry:6000/getQuotes`, completeJSONRes);
        
        console.log('Service provider response:', serviceProviderResponse.data);
        // Send the response from the service provider to the client
        res.json(serviceProviderResponse.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});


function determineServiceProvider(response) {

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