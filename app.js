'use strict';

var jwt = require('koa-jwt');

var SECRET = require('./consts').SECRET;

var serve = require('koa-static-folder');
var bodyParser = require('koa-bodyparser');
var koaBody = require('koa-body');

const app = module.exports = require('koa')()
  .use(serve('./public'))
  // .use(bodyParser()) // this is to pase all non multipart forms
  .use(koaBody({multipart:true})) // this is to pase only multipart forms
  .use(require('./routes/common'))
  .use(require('./routes/auth'))
  .use(require('./routes/users_public'))
  .use(require('./routes/action_codes'))
  .use(require('./routes/checkins'))
  .use(jwt({ secret: SECRET }))
  //protected routes below this line
  .use(require('./routes/users_private'))
  .use(require('./routes/employees_private'))
  .use(require('./routes/subcontractors_private'))
  .use(require('./routes/reports_private'))

  .listen(process.env.PORT || 3000);

// setting up posgresql on mac http://www.tunnelsup.com/setting-up-postgres-on-mac-osx
// psql -U root -W tlog_dev
// http://blog.tomnod.com/nodejs-database-queries/
