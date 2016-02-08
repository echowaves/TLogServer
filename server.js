require('koa')()
.use(require('./routes/user'))
.listen(3000);
