'use strict';

var User   = require('../models/user');
let parse = require('co-body');

var SECRET = require('../consts').SECRET;

module.exports = require('koa-router')()

//register a user
.put('/user', function *(next) {
  let data = yield parse.json(this);
    var user = new User({email: data.email, password: data.password});
    user.save();

    this.response.status = 200;
    this.body = 'sign up successfull';
    // yield next;
})

.routes();
