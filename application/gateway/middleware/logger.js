/**
 * 
 * Middlware function responsible for logging http requests
 * Logs the request content, method type, and sender url
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

const logger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
    console.log('Body:', req.body);
    next();
};

/**
 * 
 * Middleware function for more basic logging
 * Logs requests made to the gateway by their url
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

const request_logger = (req, res, next) => {
    console.log(`Received request for ${req.url}`);
    next();
};

module.exports = {logger, request_logger}