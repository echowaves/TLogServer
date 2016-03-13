'use strict';

var _ = require('lodash');
var massive = require("massive");

var db = require('../consts').DB;

var Report = function(properties) {}

// all years available on report for for particular user
Report.prototype.yearsForUser = function (user_id) {
  // console.log(user_id);
  let results = db.runSync("select distinct(extract(year from checked_in_at)) from checkins where user_id = $1 ORDER BY date_part desc", [user_id]);
  // console.log(results);
  return results;
}

module.exports = Report;
