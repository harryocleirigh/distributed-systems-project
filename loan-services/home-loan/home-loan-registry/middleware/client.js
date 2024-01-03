const Eureka = require('eureka-js-client').Eureka;
const port = 6000;

/**
 * Configure and Instantiate a Eureka Client
 * Creates a home-loan eureka discovery server
 */
const client = new Eureka({
    instance: {
      app: 'home-loan-registry',
      hostName: 'home-loan-registry',
      ipAddr: 'home-loan-registry',
      statusPageUrl: `http://home-loan-registry:${port}/info`,
      healthCheckUrl: `http://home-loan-registry:${port}/health`,
      port: {
        '$': port,
        '@enabled': true,
      },
      vipAddress: 'home-loan-registry',
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