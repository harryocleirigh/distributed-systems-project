const Eureka = require('eureka-js-client').Eureka;
const port = 6002;

/**
 * Configure and Instantiate a PTSB home loan Eureka Client
 */
const eurekaClient = new Eureka({
    instance: { 
      app: 'HOME-LOAN-SERVICES', // Use a common Eureka app ID for all related services
      instanceId: 'home-loan-ptsb', // Unique instance ID for this service
      hostName: 'home-loan-ptsb',
      ipAddr: 'home-loan-ptsb', // Adjust as needed for Docker networking
      statusPageUrl: `http://home-loan-ptsb:${port}/info`,
      healthCheckUrl: `http://home-loan-ptsb:${port}/health`,
      port: {
        '$': port,
        '@enabled': true,
      },
      vipAddress: 'home-loan-ptsb',
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