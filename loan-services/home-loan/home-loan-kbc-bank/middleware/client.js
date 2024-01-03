const Eureka = require('eureka-js-client').Eureka;
const port = 6004;

/**
 * Configure and Instantiate a KBC home loan Eureka Client
 */
const eurekaClient = new Eureka({
    instance: { 
      app: 'HOME-LOAN-SERVICES', // Use a common Eureka app ID for all related services
      instanceId: 'home-loan-kbc-bank', // Unique instance ID for this service
      hostName: 'home-loan-kbc-bank',
      ipAddr: 'home-loan-kbc-bank', // Adjust as needed for Docker networking
      statusPageUrl: `http://home-loan-kbc-bank:${port}/info`,
      healthCheckUrl: `http://home-loan-kbc-bank:${port}/health`,
      port: {
        '$': port,
        '@enabled': true,
      },
      vipAddress: 'home-loan-kbc-bank',
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