const Eureka = require('eureka-js-client').Eureka;
const port = 6004;

/**
 * Configure and Instantiate a BOI student loan Eureka Client
 */
const eurekaClient = new Eureka({
    instance: { 
      app: 'STUDENT-LOAN-SERVICES', // Use a common Eureka app ID for all related services
      instanceId: 'student-loan-boi', // Unique instance ID for this service
      hostName: 'student-loan-boi',
      ipAddr: 'student-loan-boi', // Adjust as needed for Docker networking
      statusPageUrl: `http://student-loan-boi:${port}/info`,
      healthCheckUrl: `http://student-loan-boi:${port}/health`,
      port: {
        '$': port,
        '@enabled': true,
      },
      vipAddress: 'student-loan-boi',
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