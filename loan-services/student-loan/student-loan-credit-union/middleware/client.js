const Eureka = require('eureka-js-client').Eureka;
const port = 6002;

/**
 * Configure and Instantiate a Credit Union student loan Eureka Client
 */
const eurekaClient = new Eureka({
    instance: { 
      app: 'STUDENT-LOAN-SERVICES', // Use a common Eureka app ID for all related services
      instanceId: 'student-loan-credit-union', // Unique instance ID for this service
      hostName: 'student-loan-credit-union',
      ipAddr: 'student-loan-credit-union', // Adjust as needed for Docker networking
      statusPageUrl: `http://student-loan-credit-union:${port}/info`,
      healthCheckUrl: `http://student-loan-credit-union:${port}/health`,
      port: {
        '$': port,
        '@enabled': true,
      },
      vipAddress: 'student-loan-credit-union',
      dataCenterInfo: {
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
        name: 'MyOwn',
      }
    },
    eureka: {
      host: 'eureka-server',
      port: 8761,
      servicePath: '/eureka/apps/'
    }
  });

module.exports = eurekaClient