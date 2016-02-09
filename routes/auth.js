'use strict'

var jwt = require('koa-jwt');
let parse = require('co-body');

module.exports = require('koa-router')()

.post('/authenticate', function *(next) {
  let data = yield parse.form(this);

  //TODO validate req.body.username and req.body.password
  //if is invalid, return 401
  console.log('username: ' + data.username);
  console.log('password: ' + data.password);
  if (!(data.username === 'john.doe' && data.password === 'foobar')) {
    console.log('Username or password not matched.');
    this.response.status = 401;
    this.body = 'Wrong user or password';
    yield next;
  }

  var profile = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@doe.com',
    id: 123
  };

  var secret  = "shared-secret";
  // We are sending the profile inside the token
  var token = jwt.sign(profile, secret, { expiresIn: '1m' });

  this.response.status = 200;
  this.body = {token: token};
  console.log('authenticated');
  // yield next;
})
.routes();
