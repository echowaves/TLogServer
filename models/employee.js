'use strict';

var _ = require('lodash');
var massive = require("massive");

var db = require('../consts').DB;

var Employee = function(properties) {
  _.assign(this, properties);
}


// set id to the employee obejct, call load to populate the rest of the properties
Employee.prototype.load = function () {
  var foundEmployee = db.employees.findOneSync({id:this.id});
  if(foundEmployee) {
    _.assign(this, foundEmployee);
    return this;
  } else {
    return null;// this is error
  }
}

// set activation_code to the employee object, call load to populate the rest of the properties
Employee.prototype.loadByActivationCode = function () {
  // console.log(123123123);
  // console.log(this);
  var foundEmployee = db.employees.findOneSync({activation_code:this.activation_code});
  // console.log(foundEmployee);
  if(foundEmployee) {
    _.assign(this, foundEmployee);
    return this;
  } else {
    return null;// this is error
  }
}

// load all by subcontractor
Employee.prototype.loadAllForSubcontractor = function () {
  var foundEmployees = db.employees.findSync({subcontractor_id:this.subcontractor_id});
  var employees = [];
  foundEmployees.forEach(function(item){
    var employee = new Employee();
    _.assign(employee, item);
    employees.push(employee);
  });
  return employees;
}


//load all employees for user
Employee.prototype.loadAllForUser = function (user_id) {
  var foundEmployees = db.employees.findSync({user_id:user_id}, {order:"name asc"});
  var employees = [];
  foundEmployees.forEach(function(item){
    var employee = new Employee();
    _.assign(employee, item);
    employees.push(employee);
  });
  return employees;
}

// upsert employee
Employee.prototype.save = function () {
  var inserted = db.employees.saveSync(this);
  if(!this.id) {
    this.id = inserted.id; // assign newly generated id to the object
    _.assign(this, inserted);
  };
}

// update employee
Employee.prototype.update = function () {
  return db.employees.updateSync(this);
}


//delete a employee
Employee.prototype.delete = function () {
  db.employees.destroySync({id: this.id});
}

module.exports = Employee;
