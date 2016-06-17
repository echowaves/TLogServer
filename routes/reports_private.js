'use strict';

var uuid = require('uuid');

var Report   = require('../models/report');

module.exports = require('koa-router')()

// get all years checkins available for current user
.get('/reports/years', function *(next) {
  var report = new Report();
  const years = yield report.yearsForUser.bind(report, parseInt(this.state.user.id));
  this.response.status = 200;
  this.body = { "years" : years };
})

// get all years checkins available for current user
.get('/reports/months/:year', function *(next) {
  let year = this.params.year;
  var report = new Report();
  const months = yield report.monthsForUserAndYear.bind(report, parseInt(this.state.user.id), year);
  this.response.status = 200;
  this.body = { "months" : months };
})

// get action_codes durations for year, month, user
.get('/reports/action_codes/:year/:month', function *(next) {
  let year = this.params.year;
  let month = this.params.month;
  var report = new Report();
  const action_codes = yield report.actionCodesDurationsByYearMonthForUser.bind(report, this.state.user.id, year, month);
  this.response.status = 200;
  this.body = { "action_codes" : action_codes };
})


// get employees durations for year, month, user
.get('/reports/employees/:year/:month', function *(next) {
  let year = this.params.year;
  let month = this.params.month;
  var report = new Report();
  const employees = yield report.employeesDurationsByYearMonthForUser.bind(report, this.state.user.id, year, month);
  this.response.status = 200;
  this.body = { "employees" : employees };
})




.routes();
