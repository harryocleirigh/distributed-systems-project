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
app.post('/api/submit', submit)

app.get('/', (req, res) => res.send('API Gateway is running'));

app.get('*', (req, res, next) => {
    res.status(404).send("Unknown route. Please check the URL entered")
  });


// START APP:
const port = 8000;
app.listen(port, () => console.log(`API Gateway listening on port ${port}!`));









/// UNUSED CODE:

// const { createProxyMiddleware } = require('http-proxy-middleware');

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