const Eureka = require('eureka-js-client').Eureka;
const port = 6002;
/**
 * Configure and Instantiate an Avant Money car loan Eureka Client
 */
const eurekaClient = new Eureka({
    instance: { 
      app: 'CAR-LOAN-SERVICES', // Use a common Eureka app ID for all related services
      instanceId: 'car-loan-avant-money', // Unique instance ID for this service
      hostName: 'car-loan-avant-money',
      ipAddr: 'car-loan-avant-money', // Adjust as needed for Docker networking
      statusPageUrl: `http://car-loan-avant-money:${port}/info`,
      healthCheckUrl: `http://car-loan-avant-money:${port}/health`,
      port: {
        '$': port,
        '@enabled': true,
      },
      vipAddress: 'car-loan-avant-money',
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