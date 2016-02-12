'use strict';

var User   = require('../models/user');
let parse = require('co-body');

var SECRET = require('../consts').SECRET;

module.exports = require('koa-router')()

//register a user
.put('/user', function *(next) {
  let data = yield parse.form(this);

    // console.log('Username or password not matched.');
    var user = new User({email: data.email, password: data.email});

    user.save();

    this.response.status = 200;
    this.body = 'sign up successfull';

    // yield next;


})


.get('/user', function *(next) {
  this.body = 'Hello from server user';
})

.routes();
