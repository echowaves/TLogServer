module.exports = require('koa-router')()

.get('/user', function *() {
  this.body = 'Hello from server user';
})

.get('/user/:id', function *() {
  this.body = 'Hello from server users';
})

.routes();
