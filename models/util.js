'use strict';

var db = require('../consts').DB;


var _ = require('lodash');

// var db = require('../consts').DB;

export function usersClean() {
  return function(callback) {
    db.users.destroy({}, function(err, res){
      if(err) {
        console.log("error Util.prototype.usersClean");
        console.log(err);
        callback(err, res);
        return;
      }
      callback(err, res);
    });
  }
}


export function employeesClean() {
  return function(callback) {
    db.employees.destroy({}, function(err, res){
      if(err) {
        console.log("error Util.prototype.employeesClean");
        console.log(err);
        callback(err, res);
        return;
      }
      callback(err, res);
    });
  }
}


export function checkinsClean() {
  return function(callback) {
    db.checkins.destroy({}, function(err, res){
      if(err) {
        console.log("error Util.prototype.checkinsClean");
        console.log(err);
        callback(err, res);
        return;
      }
      callback(err, res);
    });
  }
}

export function action_codesClean() {
  return function(callback) {
    db.action_codes.destroy({}, function(err, res){
      if(err) {
        console.log("error Util.prototype.action_codesClean");
        console.log(err);
        callback(err, res);
        return;
      }
      callback(err, res);
    });
  }
}


export function subcontractorsClean() {
  return function(callback) {
    db.subcontractors.destroy({}, function(err, res){
      if(err) {
        console.log("error Util.prototype.subcontractorsClean");
        console.log(err);
        callback(err, res);
        return;
      }
      callback(err, res);
    });
  }
}
