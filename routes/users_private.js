'use strict';
var jwt = require('koa-jwt');
let parse = require('co-body');
var User   = require('../models/user');

var SECRET = require('../consts').SECRET;

module.exports = require('koa-router')()

//will decode the user from jwt token, will return the only user that is authenticated
.get('/users', function *(next) {
    let data = yield parse.json(this);
    let jwtUser = this.state.user;
    var user = new User({id: jwtUser.id});
    var success = user.load();
    if(!success) {
      this.response.status = 404;
      this.body = { "error" : "User not found"};
    } else {
      this.response.status = 200;
      this.body = user;
    }
})

//update a user
.put('/users', function *(next) {
  let data = yield parse.json(this);
  let jwtUser = this.state.user;
  var user = new User({id: jwtUser.id, email: data.email, password: data.password});
  user.save();

  this.response.status = 200;
  this.body = { 'result': 'user updated, must sign in again'};
  // this.state = null;//invalidate token and force sign in again
})

.routes();
