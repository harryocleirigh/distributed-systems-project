const Eureka = require('eureka-js-client').Eureka;
const port = 6001;

/**
 * Configure and Instantiate an AIB student loan Eureka Client
 */
const eurekaClient = new Eureka({
    instance: { 
      app: 'STUDENT-LOAN-SERVICES', // Use a common Eureka app ID for all related services
      instanceId: 'student-loan-aib', // Unique instance ID for this service
      hostName: 'student-loan-aib',
      ipAddr: 'student-loan-aib', // Adjust as needed for Docker networking
      statusPageUrl: `http://student-loan-aib:${port}/info`,
      healthCheckUrl: `http://student-loan-aib:${port}/health`,
      port: {
        '$': port,
        '@enabled': true,
      },
      vipAddress: 'student-loan-aib',
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