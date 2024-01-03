const Eureka = require('eureka-js-client').Eureka;
const port = 6000;

/**
 * Configure and Instantiate a Eureka Car Loan Discovery Server
 */
const client = new Eureka({
    instance: {
      app: 'car-loan-registry',
      hostName: 'car-loan-registry',
      ipAddr: 'car-loan-registry',
      statusPageUrl: `http://car-loan-registry:${port}/info`,
      healthCheckUrl: `http://car-loan-registry:${port}/health`,
      port: {
        '$': port,
        '@enabled': true,
      },
      vipAddress: 'car-loan-registry',
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