'use strict'

var jwt = require('koa-jwt');
var SECRET = require('./consts').SECRET;

require('koa')()
.use(require('./routes/auth'))
.use(require('./routes/user_public'))
.use(jwt({ secret: SECRET }))
//protected routes below this line
.use(require('./routes/user_private'))
.listen(process.env.PORT || 3000);
