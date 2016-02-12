'use strict';

module.exports = require('koa-router')()

//register a user
.put('/user', function *(next) {
  let data = yield parse.form(this);

    // console.log('Username or password not matched.');
    this.response.status = 200;
    this.body = 'siggn up successfull';
    var user = new User({email: data.email, password: data.email});
    user.save();

    yield next;


})


.get('/user', function *(next) {
  this.body = 'Hello from server user';
})

.routes();
