const Eureka = require('eureka-js-client').Eureka;
const port = 6000;

/**
 * Configure and Instantiate a Eureka Client
 * Creates a student-loan eureka discovery server
 */
const client = new Eureka({
    instance: {
      app: 'student-loan-registry',
      hostName: 'student-loan-registry',
      ipAddr: 'student-loan-registry',
      statusPageUrl: `http://student-loan-registry:${port}/info`,
      healthCheckUrl: `http://student-loan-registry:${port}/health`,
      port: {
        '$': port,
        '@enabled': true,
      },
      vipAddress: 'student-loan-registry',
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

module.exports = client