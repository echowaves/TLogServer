'use strict';

var uuid = require('uuid');

var Report   = require('../models/report');

module.exports = require('koa-router')()

// get all years checkins available for current user
.get('/reports/years', function *(next) {
  const years = new Report().yearsForUser(this.state.user.id);
  this.response.status = 200;
  this.body = { "years" : years };
})

// get all years checkins available for current user
.get('/reports/months/:year', function *(next) {
  let year = this.params.year;
  const months = new Report().monthsForUserAndYear(this.state.user.id, year);
  this.response.status = 200;
  this.body = { "months" : months };
})


// get employees durations for year, month, user
.get('/reports/employees/:year/:month', function *(next) {
  let year = this.params.year;
  let month = this.params.month;
  const employees = new Report().employeeDurationsByYearMonthForUser(this.state.user.id, year, month);
  this.response.status = 200;
  this.body = { "employees" : employees };
})




.routes();
