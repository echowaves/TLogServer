'use strict';

module.exports = require('koa-router')()

//will decode the user from jwt token

//create a new employee
.put('/employees', function *(next) {

  var token = this.request.header.authorization.replace("Bearer ", "");
  this.response.status = 200;
  this.body = this.state.user;
  yield next;
})

//update an employee
.post('/employees', function *(next) {

  var token = this.request.header.authorization.replace("Bearer ", "");
  this.response.status = 200;
  this.body = this.state.user;
  yield next;
})

//delete an employee
.delete('/employees', function *(next) {

  var token = this.request.header.authorization.replace("Bearer ", "");
  this.response.status = 200;
  this.body = this.state.user;
  yield next;
})

.routes();
