'use strict';

var User   = require('../models/user');

var SECRET = require('../consts').SECRET;

module.exports = require('koa-router')()

//register a user
.post('/users', function *(next) {
  let data = this.request.body;
    var user = new User({email: data.email, password: data.password});
    yield user.save.bind(user);

    this.response.status = 200;
    this.body = { "result": 'sign up successfull', "id" : user.id};
    // yield next;
})

.routes();
