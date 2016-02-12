'use strict';

module.exports = require('koa-router')()

//register a user
.put('/user', function *(next) {

})


.get('/user', function *(next) {
  this.body = 'Hello from server user';
})

.routes();
