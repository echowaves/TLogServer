'use strict';

module.exports = require('koa-router')()

//update a user
// .post('/user', function *(next) {
//
// })
//will decode the user from jwt token
.get('/user', function *(next) {
  console.log(this.state.user);
  var token = this.request.header.authorization.replace("Bearer ", "");
  this.response.status = 200;
  this.body = { "token" : token};

  yield next;
})

.routes();
