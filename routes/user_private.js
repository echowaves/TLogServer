'use strict';
var jwt = require('koa-jwt');
var SECRET = require('../consts').SECRET;

module.exports = require('koa-router')()

//will decode the user from jwt token, will return the only user that is authenticated
.get('/users', function *(next) {

  var token = this.request.header.authorization.replace("Bearer ", "");
  var decoded = jwt.verify(token, SECRET);
    this.response.status = 200;
    this.body = this.state.user;
})

.routes();
