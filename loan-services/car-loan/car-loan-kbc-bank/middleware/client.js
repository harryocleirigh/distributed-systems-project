const Eureka = require('eureka-js-client').Eureka;
const port = 6004;

/**
 * Configure and Instantiate an KBC car loan Eureka Client
 */
const eurekaClient = new Eureka({
    instance: { 
      app: 'CAR-LOAN-SERVICES', // Use a common Eureka app ID for all related services
      instanceId: 'car-loan-kbc-bank', // Unique instance ID for this service
      hostName: 'car-loan-kbc-bank',
      ipAddr: 'car-loan-kbc-bank', // Adjust as needed for Docker networking
      statusPageUrl: `http://car-loan-kbc-bank:${port}/info`,
      healthCheckUrl: `http://car-loan-kbc-bank:${port}/health`,
      port: {
        '$': port,
        '@enabled': true,
      },
      vipAddress: 'car-loan-kbc-bank',
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