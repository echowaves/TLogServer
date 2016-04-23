'use strict';

var API_VERSION_ANDROID = require('../consts').API_VERSION_ANDROID;
var API_VERSION_IOS     = require('../consts').API_VERSION_IOS;




module.exports = require('koa-router')()


.get('/api_version/ios', function *(next) {
        this.response.status = 200;
        this.body = {version: API_VERSION_IOS};
})
.get('/api_version/android', function *(next) {
        this.response.status = 200;
        this.body = {version: API_VERSION_ANDROID};
})
.routes();
