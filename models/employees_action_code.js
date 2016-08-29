'use strict';

var _ = require('lodash');
var massive = require("massive");

var db = require('../consts').DB;

// upsert EmployeesActionCode
export function save(params) {
  return function(callback) {
    var inserted = db.employees_action_codes.save(params, function(err, res) {
      if(err) {
        console.log("error EmployeesActionCode.save");
        console.log(err);
        callback(err, res);
        return;
      };
      callback(err, res);
    });
  }
}

//delete a EmployeesActionCode
export function destroy(params) {
  return function(callback) {
    db.employees_action_codes.destroy(params, function(err, res){
      if(err) {
        console.log("error EmployeesActionCode.destroy");
        console.log(err);
        callback(err, res);
        return;
      }
      callback(err, res);
    });
  }
}
