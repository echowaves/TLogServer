'use strict';
var jwt = require('koa-jwt');
var SECRET = require('../consts').SECRET;

module.exports = require('koa-router')()

//will decode the user from jwt token
.get('/users/:id', function *(next) {

  var user_id = this.params.id;

  var token = this.request.header.authorization.replace("Bearer ", "");
  var decoded = jwt.verify(token, SECRET);
  if(decoded.id != user_id) {
    this.response.status = 401;
    this.body = { error: 'Unauthorised user_id'};
  } else {
    this.response.status = 200;
    this.body = this.state.user;
  }
  yield next;

})

.routes();
