'use strict';

var uuid = require('uuid');

var Report   = require('../models/report');

module.exports = require('koa-router')()

// get all employess for current user
.get('/reports/years', function *(next) {
  var report = new Report();
  var years = report.yearsForUser(this.state.user.id);
  this.response.status = 200;
  this.body = { "results" : years };
})




.routes();
