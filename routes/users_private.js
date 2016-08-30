var jwt = require('koa-jwt');
var SECRET = require('../consts').SECRET;

import * as User from '../models/user';

module.exports = require('koa-router')()

//will decode the user from jwt token, will return the only user that is authenticated
.get('/users', function *(next) {
    let data = this.request.body;
    let jwtUser = this.state.user;
    var user = yield User.load({id: jwtUser.id});
    if(!user) {
      this.response.status = 404;
      this.body = { "error" : "User not found"};
    } else {
      this.response.status = 200;
      this.body = user;
    }
})

//update a user
.put('/users', function *(next) {
  let data = this.request.body;
  let jwtUser = this.state.user;
  var user = {id: jwtUser.id}
  if(data.email) {
    user.email = data.email;
  }
  if(data.password) {
    user.password = data.password;
  }
  yield User.save(user);

  this.response.status = 200;
  this.body = { 'result': 'user updated, must sign in again'};
  // this.state = null;//invalidate token and force sign in again
})

.routes();
