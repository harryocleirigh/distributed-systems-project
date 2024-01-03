const Eureka = require('eureka-js-client').Eureka;
const port = 6004;

/**
 * Configure and Instantiate a KBC personal loan Eureka Client
 */
const eurekaClient = new Eureka({
    instance: { 
      app: 'PERSONAL-LOAN-SERVICES', // Use a common Eureka app ID for all related services
      instanceId: 'personal-loan-kbc-bank', // Unique instance ID for this service
      hostName: 'personal-loan-kbc-bank',
      ipAddr: 'personal-loan-kbc-bank', // Adjust as needed for Docker networking
      statusPageUrl: `http://personal-loan-kbc-bank:${port}/info`,
      healthCheckUrl: `http://personal-loan-kbc-bank:${port}/health`,
      port: {
        '$': port,
        '@enabled': true,
      },
      vipAddress: 'personal-loan-kbc-bank',
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