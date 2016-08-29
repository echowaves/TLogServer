'use strict';

var _ = require('lodash');
var massive = require("massive");

var db = require('../consts').DB;

// all years available on report for for particular user
export function yearsForUser(user_id) {
  return function(callback) {
    db.run("select distinct(extract(year from checked_in_at)) from checkins where user_id = $1 ORDER BY date_part desc", [user_id], function(err, res) {
      if(err) {
        console.log("error Report.yearsForUser");
        console.log(err);
        callback(err, res);
        return;
      };
      callback(err, res);
    });
  }
}

// all years available on report for for particular user
export function monthsForUserAndYear(user_id, year) {
  return function(callback) {
    db.run("select distinct(extract(month from checked_in_at)) from checkins WHERE user_id = $1 and EXTRACT(YEAR FROM checked_in_at) = $2 ORDER BY date_part", [user_id, year], function(err, res) {
      if(err) {
        console.log("error Report.prototype.monthsForUserAndYear");
        console.log(err);
        callback(err, res);
        return;
      };
      callback(err, res);
    });
  }
}

// action codes durations for year, month, user
export function actionCodesDurationsByYearMonthForUser(user_id, year, month) {
  return function(callback) {
    db.run("SELECT a.id, a.code, a.description, round(sum(EXTRACT(epoch FROM c.duration))/3600) AS sum FROM checkins c, action_codes a WHERE a.id = c.action_code_id and c.user_id = $1  and EXTRACT(YEAR FROM checked_in_at) = $2  and EXTRACT(MONTH FROM checked_in_at) = $3 GROUP BY (a.id) ORDER BY a.code, a.description",  [user_id, year, month], function(err, res) {
      if(err) {
        console.log("error Report.prototype.actionCodesDurationsByYearMonthForUser");
        console.log(err);
        callback(err, res);
        return;
      };
      callback(err, res);
    });
  }
}


// employees durations for year, month, user
export function employeesDurationsByYearMonthForUser(user_id, year, month) {
  return function(callback) {
    db.run("SELECT e.email, e.name, round(sum(EXTRACT(epoch FROM c.duration))/3600) AS sum FROM checkins c, employees e WHERE c.email = e.email and c.user_id = $1  and EXTRACT(YEAR FROM checked_in_at) = $2  and EXTRACT(MONTH FROM checked_in_at) = $3    GROUP BY (e.email, e.name) ORDER BY e.name", [user_id, year, month], function(err, res) {
      if(err) {
        console.log("error Report.prototype.employeesDurationsByYearMonthForUser");
        console.log(err);
        callback(err, res);
        return;
      };
      callback(err, res);
    });
  }
}

// SELECT   e.name, sum(duration) FROM checkins c, employees e WHERE c.email = e.email and c.user_id = 8216 GROUP BY (e.name) ORDER BY e.name;
