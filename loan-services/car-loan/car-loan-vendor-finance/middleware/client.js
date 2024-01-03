const Eureka = require('eureka-js-client').Eureka;
const port = 6003;

/**
 * Configure and Instantiate a Vendor Finance car loan Eureka Client
 */
const eurekaClient = new Eureka({
    instance: { 
      app: 'CAR-LOAN-SERVICES', // Use a common Eureka app ID for all related services
      instanceId: 'car-loan-vendor-finance', // Unique instance ID for this service
      hostName: 'car-loan-vendor-finance',
      ipAddr: 'car-loan-vendor-finance', // Adjust as needed for Docker networking
      statusPageUrl: `http://car-loan-vendor-finance:${port}/info`,
      healthCheckUrl: `http://car-loan-vendor-finance:${port}/health`,
      port: {
        '$': port,
        '@enabled': true,
      },
      vipAddress: 'car-loan-vendor-finance',
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