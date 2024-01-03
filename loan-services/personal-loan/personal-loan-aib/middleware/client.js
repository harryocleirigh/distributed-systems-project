const Eureka = require('eureka-js-client').Eureka;
const port = 6001;

/**
 * Configure and Instantiate an AIB personal loan Eureka Client
 */
const eurekaClient = new Eureka({
    instance: { 
      app: 'PERSONAL-LOAN-SERVICES', // Use a common Eureka app ID for all related services
      instanceId: 'personal-loan-aib', // Unique instance ID for this service
      hostName: 'personal-loan-aib',
      ipAddr: 'personal-loan-aib', // Adjust as needed for Docker networking
      statusPageUrl: `http://personal-loan-aib:${port}/info`,
      healthCheckUrl: `http://personal-loan-aib:${port}/health`,
      port: {
        '$': port,
        '@enabled': true,
      },
      vipAddress: 'personal-loan-aib',
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