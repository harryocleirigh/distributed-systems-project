const Eureka = require('eureka-js-client').Eureka;
const port = 6003;

/**
 * Configure and Instantiate a BOI home loan Eureka Client
 */
const eurekaClient = new Eureka({
    instance: { 
      app: 'HOME-LOAN-SERVICES', // Use a common Eureka app ID for all related services
      instanceId: 'home-loan-boi', // Unique instance ID for this service
      hostName: 'home-loan-boi',
      ipAddr: 'home-loan-boi', // Adjust as needed for Docker networking
      statusPageUrl: `http://home-loan-boi:${port}/info`,
      healthCheckUrl: `http://home-loan-boi:${port}/health`,
      port: {
        '$': port,
        '@enabled': true,
      },
      vipAddress: 'home-loan-boi',
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