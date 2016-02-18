'use strict';

var _ = require('lodash');
var massive = require("massive");

var db = require('../consts').DB;

var Employee = function(properties) {
  _.assign(this, properties);
}


// set id to the employee obejct, call load to populate the rest of the properties
Employee.prototype.load = function () {
  var foundEmployee = db.employees.findOneSync({id: this.id});
  if(foundEmployee) {
    _.assign(this, foundEmployee);
    return this;
  } else {
    return null;// this is error
  }
}

// upsert employee
Employee.prototype.save = function () {
  var inserted = db.employees.saveSync(this);
    if(!this.id) {
      this.id = inserted.id; // assign newly generated id to the object
    }
}

//delete a employee
Employee.prototype.delete = function () {
  db.employees.destroySync(this);
}

module.exports = Employee;
