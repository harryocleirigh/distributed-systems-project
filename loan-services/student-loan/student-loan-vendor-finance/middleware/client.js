const Eureka = require('eureka-js-client').Eureka;
const port = 6003;

/**
 * Configure and Instantiate a Vendor Finance student loan Eureka Client
 */
const eurekaClient = new Eureka({
    instance: { 
      app: 'STUDENT-LOAN-SERVICES', // Use a common Eureka app ID for all related services
      instanceId: 'student-loan-vendor-finance', // Unique instance ID for this service
      hostName: 'student-loan-vendor-finance',
      ipAddr: 'student-loan-vendor-finance', // Adjust as needed for Docker networking
      statusPageUrl: `http://student-loan-vendor-finance:${port}/info`,
      healthCheckUrl: `http://student-loan-vendor-finance:${port}/health`,
      port: {
        '$': port,
        '@enabled': true,
      },
      vipAddress: 'student-loan-vendor-finance',
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