const Eureka = require('eureka-js-client').Eureka;
const port = 6001;

/**
 * Configure and Instantiate an AIB home loan Eureka Client
 */
const eurekaClient = new Eureka({
    instance: { 
      app: 'HOME-LOAN-SERVICES', // Use a common Eureka app ID for all related services
      instanceId: 'home-loan-aib', // Unique instance ID for this service
      hostName: 'home-loan-aib',
      ipAddr: 'home-loan-aib', // Adjust as needed for Docker networking
      statusPageUrl: `http://home-loan-aib:${port}/info`,
      healthCheckUrl: `http://home-loan-aib:${port}/health`,
      port: {
        '$': port,
        '@enabled': true,
      },
      vipAddress: 'home-loan-aib',
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