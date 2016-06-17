'use strict';

var _ = require('lodash');
var massive = require("massive");

var db = require('../consts').DB;

var ActionCode = function(properties) {
  _.assign(this, properties);
}


// lookup action codes by code and/or description
ActionCode.prototype.lookup = function (lookupString, callback) {
  db.run("select * from action_codes where code ilike $1 or description ilike $1 limit 100", ['%' + lookupString + '%'],
  function(err, actionCodesRes) {
    if(err) {
      console.log("error ActionCode.prototype.lookup");
      console.log(err);
      callback(err, res);
      return;
    };
    callback(err, actionCodesRes);
  });
}


// loadAll
ActionCode.prototype.loadAll = function (callback) {
  db.action_codes.find(function(err, actionCodesRes) {
    if(err) {
      console.log("error ActionCode.prototype.loadAll");
      console.log(err);
      callback(err, res);
      return;
    };
    callback(err, actionCodesRes);
  });
}


// set id to the action_code obejct, call load to populate the rest of the properties
ActionCode.prototype.load = function (callback) {
  var that = this;
  db.action_codes.findOne({id:this.id}, function(err, res){
    if(err) {
      console.log("error ActionCode.prototype.load");
      console.log(err);
      callback(err, res);
      return;
    }
    //full product with new id returned
    if(res) {
      _.assign(that, res);
    }
    callback(err, res);
  })
}

// upsert actionCode
ActionCode.prototype.save = function (callback) {
  var that = this;
  var inserted = db.action_codes.save(this, function(err, res){
    if(err) {
      console.log("error ActionCode.prototype.save");
      console.log(err);
      callback(err, res);
      return;
    }
    if(res) {
      _.assign(that, res);
    }
    callback(err, res);
  });
}

//delete a actionCode
ActionCode.prototype.delete = function (callback) {
  db.action_codes.destroy({id: this.id}, function(err, res){
    if(err) {
      console.log("error ActionCode.prototype.delete");
      console.log(err);
      callback(err, res);
      return;
    }
    callback(err, res);
  });
}

// load all ActionCodes for employee
ActionCode.prototype.loadAllForEmployee = function (employee_id, callback) {
  db.run("select * from action_codes where id in (select action_code_id from employees_action_codes where employee_id  = $1)", [employee_id], function(err, actionCodesRes) {
  if(err) {
    console.log("error ActionCode.prototype.loadAllForEmployee");
    console.log(err);
    callback(err, res);
    return;
  };
  callback(err, actionCodesRes);
});
}


module.exports = ActionCode;
