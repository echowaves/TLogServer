'use strict'

var jwt = require('koa-jwt');

require('koa')()
.use(require('./routes/auth'))
.use(require('./routes/user_public'))
.use(jwt({ secret: 'shared-secret' }))
//protected routes below this line
.use(require('./routes/user_private'))
.listen(3000);
