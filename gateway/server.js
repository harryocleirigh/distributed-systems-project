const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors'); // Import the cors package

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
    target: 'http://127.0.0.1:5000/calculate_credit_score', // URL of our flask app that will create the credit score for our user
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
    onProxyRes: (proxyRes, req, res) => {
        let body = [];
        proxyRes.on('data', (chunk) => {
            body.push(chunk);
        });
        proxyRes.on('end', () => {
            
            body = Buffer.concat(body).toString();
            console.log("response from proxied server:", body);
            
            const proxiedResponse = JSON.parse(body);
            req.body.creditScore = proxiedResponse.creditScore;
            res.json(req.body);
        });
    }
}));

app.get('/', (req, res) => res.send('API Gateway is running'));
app.listen(port, () => console.log(`API Gateway listening on port ${port}!`));