'use strict'

module.exports = require('koa-router')()

.put('/user', function *(next) {

})

.get('/user/:id', function *(next) {
  this.body = 'Hello from server users';
})

.routes();
