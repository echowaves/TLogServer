'use strict';

var _ = require('lodash');
var massive = require("massive");

var db = require('../consts').DB;

var Report = function(properties) {
}


// all years available on report for for particular user
Report.prototype.yearsForUser = function (user_id) {
  return db.runSync("select distinct(extract(year from checked_in_at)) from checkins where user_id = $3", [user_id]);
}

module.exports = Report;
