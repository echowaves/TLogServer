'use strict';

var User   = require('../models/user');

var jwt = require('koa-jwt');
let parse = require('co-body');

var SECRET = require('../consts').SECRET;

module.exports = require('koa-router')()

.post('/auth', function *(next) {
  let data = yield parse.json(this);
  var user = new User({email: data.email, password: data.password});

  var token = user.validateUserAndGenerateToken();

  if (token == null) {
    this.response.status = 401;
    this.body = 'Wrong user or password';
    yield next;
  } else {
    //authenticated
        this.response.status = 200;
        this.body = {token: token};
  }
  // yield next;
})
.routes();
