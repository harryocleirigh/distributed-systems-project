const Eureka = require('eureka-js-client').Eureka;
const port = 6003;

/**
 * Configure and Instantiate an An Post personal loan Eureka Client
 */
const eurekaClient = new Eureka({
    instance: { 
      app: 'PERSONAL-LOAN-SERVICES', // Use a common Eureka app ID for all related services
      instanceId: 'personal-loan-an-post', // Unique instance ID for this service
      hostName: 'personal-loan-an-post',
      ipAddr: 'personal-loan-an-post', // Adjust as needed for Docker networking
      statusPageUrl: `http://personal-loan-an-post:${port}/info`,
      healthCheckUrl: `http://personal-loan-an-post:${port}/health`,
      port: {
        '$': port,
        '@enabled': true,
      },
      vipAddress: 'personal-loan-an-post',
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