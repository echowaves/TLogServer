'use strict';

var _ = require('lodash');
var massive = require("massive");

var db = require('../consts').DB;

var ActionCode = function(properties) {
  _.assign(this, properties);
}


// lookup action codes by code and/or description
ActionCode.prototype.lookup = function (lookupString) {
  return db.runSync("select * from action_codes where code ilike $1 or description ilike $1 limit 100", ['%' + lookupString + '%']);
}

// loadAll
ActionCode.prototype.loadAll = function () {
  return db.action_codes.findSync();
}


// set id to the action_code obejct, call load to populate the rest of the properties
ActionCode.prototype.load = function () {
  var foundActionCode = db.action_codes.findOneSync(this.id);
  if(foundActionCode) {
    _.assign(this, foundActionCode);
    return this;
  } else {
    return null;// this is error
  }
}

// upsert actionCode
ActionCode.prototype.save = function () {
  var inserted = db.action_codes.saveSync(this);
    if(!this.id) {
      this.id = inserted.id; // assign newly generated id to the object
    }
}

//delete a actionCode
ActionCode.prototype.delete = function () {
  db.action_codes.destroySync({id: this.id});
}

// load all ActionCodes for employee
ActionCode.prototype.loadAllForEmployee = function (employee_id) {
  return db.runSync("select * from action_codes where id in (select action_code_id from employees_action_codes where employee_id  = $1)", [employee_id]);
}


module.exports = ActionCode;
