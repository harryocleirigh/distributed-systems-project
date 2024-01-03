const Eureka = require('eureka-js-client').Eureka;
const port = 6001;

/**
 * Configure and Instantiate an AIB car loan Eureka Client
 */
const eurekaClient = new Eureka({
    instance: { 
      app: 'CAR-LOAN-SERVICES', // Use a common Eureka app ID for all related services
      instanceId: 'car-loan-aib', // Unique instance ID for this service
      hostName: 'car-loan-aib',
      ipAddr: 'car-loan-aib', // Adjust as needed for Docker networking
      statusPageUrl: `http://car-loan-aib:${port}/info`,
      healthCheckUrl: `http://car-loan-aib:${port}/health`,
      port: {
        '$': port,
        '@enabled': true,
      },
      vipAddress: 'car-loan-aib',
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