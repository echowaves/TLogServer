'use strict';

var _ = require('lodash');
var massive = require("massive");

var db = require('../consts').DB;

// set id to the employee obejct, call load to populate the rest of the properties
export function load(params) {
  return function(callback) {
    db.employees.findOne(params, function(err, res){
      if(err) {
        console.log("error Employee.prototype.load");
        console.log(err);
        callback(err, res);
        return;
      };
      callback(err, res);
    });
  }
}

// set activation_code to the employee object, call load to populate the rest of the properties
export function loadByActivationCode(activation_code) {
  return function(callback) {
    db.employees.findOne({activation_code}, function(err, res){
      if(err) {
        console.log("error Employee.prototype.loadByActivationCode");
        console.log(err);
        callback(err, res);
        return;
      };
      callback(err, res);
    });
  }
}

// load all by subcontractor
export function loadAllForSubcontractor(subcontractor_id) {
  return function(callback) {
    db.employees.find({subcontractor_id}, function(err, foundEmployees) {
      if(err) {
        console.log("error Employee.prototype.loadAllForSubcontractor");
        console.log(err);
        callback(err, foundEmployees);
        return;
      };
      callback(err, foundEmployees);
    });
  }
}


//load all employees for user
export function loadAllForUser(user_id) {
  return function(callback) {
    db.employees.find({user_id}, {order:"name asc"}, function(err, foundEmployees) {
      if(err) {
        console.log("error Employee.prototype.loadAllForUser");
        console.log(err);
        callback(err, foundEmployees);
        return;
      };
      callback(err, foundEmployees);
    });
  }
}


// upsert employee
export function save(params) {
  return function(callback) {
    db.employees.save(params, function(err, res) {
      if(err) {
        console.log("error Employee.prototype.save");
        console.log(err);
        callback(err, res);
        return;
      };
      callback(err, res);
    });
  }
}

//delete a employee
export function destroy(params) {
  return function(callback) {
    db.employees.destroy(params, function(err, res){
      if(err) {
        console.log("error Employee.prototype.delete");
        console.log(err);
        callback(err, res);
        return;
      }
      callback(err, res);
    });
  }
}
