import _ from 'lodash';
// var _ = require('lodash');
var massive = require("massive");

var db = require('../consts').DB;

// var ActionCode = function(properties) {
//   _.assign(this, properties);
// }



// lookup action codes by code and/or description
export function lookup(lookupString) {
  return function(callback) {
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
}


// loadAll
export function loadAll() {
  return function(callback) {
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
}

// set id to the action_code obejct, call load to populate the rest of the properties
export function load(params) {
  return function(callback) {
    db.action_codes.findOne({id:params.id}, function(err, res){
      if(err) {
        console.log("error ActionCode.prototype.load");
        console.log(err);
        callback(err, res);
        return;
      }
      callback(err, res);
    })
  }
}

// upsert actionCode
export function save(params) {
  return function(callback) {
    var inserted = db.action_codes.save(params, function(err, res){
      if(err) {
        console.log("error ActionCode.prototype.save");
        console.log(err);
        callback(err, res);
        return;
      }
      callback(err, res);
    });
  }
}

//delete a actionCode
export function destroy(params) {
  return function(callback) {
    db.action_codes.destroy(params, function(err, res){
      if(err) {
        console.log("error ActionCode.prototype.delete");
        console.log(err);
        callback(err, res);
        return;
      }
      callback(err, res);
    });
  }
}

// load all ActionCodes for employee
export function loadAllForEmployee(params) {
  return function(callback) {
    db.run("select * from action_codes where id in (select action_code_id from employees_action_codes where employee_id  = $1)", [params.employee_id], function(err, actionCodesRes) {
      if(err) {
        console.log("error ActionCode.prototype.loadAllForEmployee");
        console.log(err);
        callback(err, res);
        return;
      };
      callback(err, actionCodesRes);
    });
  }
}
