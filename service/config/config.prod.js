'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1526702130868_2632';

  // add your config here
  config.middleware = [];
    config.data={
        dir:'/usr/local/src/novel/downLoad/'
    }
    config.mongoose  = {
        url: 'mongodb://127.0.0.1:27017/db_novel',
        options: {},
    }
    config.cors  = {
        // origin: 'localhost:8080',
        origin: '*',
        credentials:true,
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
    }
    exports.cluster = {
        listen: {
            port: 7001,
            hostname: 'www.tengg.win',
        },
    }
    config.security = {
        csrf: {
            enable: false,
            // headerName: 'x-csrf-token', // 通过 header 传递 CSRF token 的默认字段为 x-csrf-token
        },
        domainWhiteList: [ 'http://localhost:8080','http://localhost:8081','https://tengg.win:7001']
    };
  return config;
};
