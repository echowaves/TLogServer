'use strict'

module.exports = require('koa-router')()

.get('/user', function *(next) {
  this.body = 'Hello from server user';
})

.routes();
