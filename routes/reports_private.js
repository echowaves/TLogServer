'use strict';

var uuid = require('uuid');

import * as Report from '../models/report';

module.exports = require('koa-router')()

// get all years checkins available for current user
.get('/reports/years', function *(next) {
  const years = yield Report.yearsForUser(parseInt(this.state.user.id));
  this.response.status = 200;
  this.body = { "years" : years };
})

// get all years checkins available for current user
.get('/reports/months/:year', function *(next) {
  let year = this.params.year;
  const months = yield Report.monthsForUserAndYear(parseInt(this.state.user.id), year);
  this.response.status = 200;
  this.body = { "months" : months };
})

// get action_codes durations for year, month, user
.get('/reports/action_codes/:year/:month', function *(next) {
  let year = this.params.year;
  let month = this.params.month;
  const action_codes = yield Report.actionCodesDurationsByYearMonthForUser(this.state.user.id, year, month);
  this.response.status = 200;
  this.body = { "action_codes" : action_codes };
})


// get employees durations for year, month, user
.get('/reports/employees/:year/:month', function *(next) {
  let year = this.params.year;
  let month = this.params.month;
  const employees = yield Report.employeesDurationsByYearMonthForUser(this.state.user.id, year, month);
  this.response.status = 200;
  this.body = { "employees" : employees };
})


.routes();
