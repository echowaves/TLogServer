'use strict';

var _ = require('lodash');
var massive = require("massive");

var db = require('../consts').DB;

var EmployeesActionCode = function(properties) {
  _.assign(this, properties);
}

// upsert EmployeesActionCode
EmployeesActionCode.prototype.save = function (callback) {
  var that = this;
  var inserted = db.employees_action_codes.save(_.omit(that, _.keys(_.pickBy(that,_.isFunction))), function(err, res) {
    if(err) {
      console.log("error EmployeesActionCode.prototype.save");
      console.log(err);
      callback(err, res);
      return;
    };
    _.assign(that, res);
    callback(err, res);
  });
}

//delete a EmployeesActionCode
EmployeesActionCode.prototype.delete = function (callback) {
  db.employees_action_codes.destroy(this, function(err, res){
    if(err) {
      console.log("error EmployeesActionCode.prototype.delete");
      console.log(err);
      callback(err, res);
      return;
    }
    callback(err, res);
  });
}

module.exports = EmployeesActionCode;
