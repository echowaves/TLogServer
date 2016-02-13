'use strict';

var User   = require('../models/user');

var jwt = require('koa-jwt');
let parse = require('co-body');

var SECRET = require('../consts').SECRET;

module.exports = require('koa-router')()

.post('/auth', function *(next) {
  let data = yield parse.form(this);
  var token = new User().validateUserAndGenerateToken(data.email, data.password);

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
