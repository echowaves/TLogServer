'use strict'

module.exports = require('koa-router')()

.get('/user/:id', function *(next) {
  this.body = 'Hello from server users';
})

.routes();
