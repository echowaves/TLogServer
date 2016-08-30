import * as User from '../models/user';

var jwt = require('koa-jwt');

var SECRET = require('../consts').SECRET;

module.exports = require('koa-router')()

// create new auth token
.post('/auth', function *(next) {
  let data = this.request.body;
  var user = {email: data.email, password: data.password};

  var token = yield User.validateUserAndGenerateToken(user);

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
