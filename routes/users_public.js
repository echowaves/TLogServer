import * as User from '../models/user';

var SECRET = require('../consts').SECRET;

module.exports = require('koa-router')()

//register a user
.post('/users', function *(next) {
  let data = this.request.body;
    var user =
    yield User.save({email: data.email, password: data.password});

    this.response.status = 200;
    this.body = { "result": 'sign up successfull', "id" : user.id};
    // yield next;
})

.routes();
