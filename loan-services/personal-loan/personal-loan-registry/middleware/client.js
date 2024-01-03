const Eureka = require('eureka-js-client').Eureka;
const port = 6000;

/**
 * Configure and Instantiate a Eureka Client
 * Creates a personal-loan eureka discovery server
 */
const client = new Eureka({
    instance: {
      app: 'personal-loan-registry',
      hostName: 'personal-loan-registry',
      ipAddr: 'personal-loan-registry',
      statusPageUrl: `http://personal-loan-registry:${port}/info`,
      healthCheckUrl: `http://personal-loan-registry:${port}/health`,
      port: {
        '$': port,
        '@enabled': true,
      },
      vipAddress: 'personal-loan-registry',
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