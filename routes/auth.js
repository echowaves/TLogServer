'use strict';

var User   = require('../models/user');

var jwt = require('koa-jwt');

var SECRET = require('../consts').SECRET;

module.exports = require('koa-router')()

// create new auth token
.post('/auth', function *(next) {
  let data = this.request.body;
  var user = new User({email: data.email, password: data.password});
console.log("trying to authenticate: " + data.email);

  var token = user.validateUserAndGenerateToken();

  if (token == null) {
    this.response.status = 401;
    this.body = { error: 'Wrong user or password'};
    // yield next;
  } else {
    //authenticated
        this.response.status = 200;
        this.body = {token: token};
  }
  // yield next;
})
.routes();
