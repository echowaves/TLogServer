'use strict';

var db = require('../consts').DB;


var _ = require('lodash');

// var db = require('../consts').DB;

var Util = function(properties) {
  _.assign(this, properties);
}


Util.prototype.usersClean = function (callback) {
  db.users.destroy({}, function(err, res){
    if(err) {
      console.log("error");
      console.log(err);
      callback(err, res);
      return;
    }
    callback(err, res);
  });
}

Util.prototype.employeesClean = function (callback) {
  db.employees.destroy({}, function(err, res){
    if(err) {
      console.log("error");
      console.log(err);
      callback(err, res);
      return;
    }
    callback(err, res);
  });
}

Util.prototype.checkinsClean = function (callback) {
  db.checkins.destroy({}, function(err, res){
    if(err) {
      console.log("error");
      console.log(err);
      callback(err, res);
      return;
    }
    callback(err, res);
  });
}

Util.prototype.action_codesClean = function (callback) {
  db.action_codes.destroy({}, function(err, res){
    if(err) {
      console.log("error");
      console.log(err);
      callback(err, res);
      return;
    }
    callback(err, res);
  });
}

Util.prototype.subcontractorsClean = function (callback) {
  db.subcontractors.destroy({}, function(err, res){
    if(err) {
      console.log("error");
      console.log(err);
      callback(err, res);
      return;
    }
    callback(err, res);
  });
}



module.exports = Util;
