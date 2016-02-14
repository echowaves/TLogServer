'use strict';

module.exports = require('koa-router')()

//update a user
// .post('/user', function *(next) {
//
// })
//will decode the user from jwt token
.get('/user', function *(next) {

  var token = this.request.header.authorization.replace("Bearer ", "");
  this.response.status = 200;
  this.body = this.state.user;
  yield next;
})

.routes();
