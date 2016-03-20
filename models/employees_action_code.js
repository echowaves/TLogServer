'use strict';

var _ = require('lodash');
var massive = require("massive");

var db = require('../consts').DB;

var EmployeesActionCode = function(properties) {
  _.assign(this, properties);
}

// upsert EmployeesActionCode
EmployeesActionCode.prototype.save = function () {
  var inserted = db.employees_action_codes.saveSync(this);
    if(!this.id) {
      this.id = inserted.id; // assign newly generated id to the object
    }
}

//delete a EmployeesActionCode
EmployeesActionCode.prototype.delete = function () {
  db.employees_action_codes.destroySync(this);
}

module.exports = EmployeesActionCode;
