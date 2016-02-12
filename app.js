'use strict';

var jwt = require('koa-jwt');

var SECRET = require('./consts').SECRET;

const app = module.exports = require('koa')()
.use(require('./routes/auth'))
.use(require('./routes/user_public'))
.use(jwt({ secret: SECRET }))
//protected routes below this line
.use(require('./routes/user_private'))
.listen(process.env.PORT || 3000);



// setting up posgresql on mac http://www.tunnelsup.com/setting-up-postgres-on-mac-osx
// psql -U root -W tlog_dev
// http://blog.tomnod.com/nodejs-database-queries/
