'use strict';

var _ = require('lodash');
var massive = require("massive");

var db = require('../consts').DB;

var Employee = function(properties) {
  _.assign(this, properties);
}


// set id to the employee obejct, call load to populate the rest of the properties
Employee.prototype.load = function (callback) {
  var that = this;
  db.employees.findOne({id:that.id}, function(err, res){
    if(err) {
      console.log("error");
      console.log(err);
      callback(err, res);
      return;
    };
    _.assign(that, res);
    callback(err, res);
  });
}

// set activation_code to the employee object, call load to populate the rest of the properties
Employee.prototype.loadByActivationCode = function () {
  var foundEmployee = db.employees.findOneSync({activation_code:this.activation_code});
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
Employee.prototype.save = function (callback) {
  var that = this;
  db.employees.save(that, function(err, res) {
    if(err) {
      console.log("error");
      console.log(err);
      callback(err, res);
      return;
    };
    _.assign(that, res);
    callback(err, res);
  });
}

// update employee
Employee.prototype.update = function (callback) {
  var that = this;
  db.employees.update({id: that.id}, that,  function(err, res){
    if(err) {
      console.log("error");
      console.log(err);
      callback(err, res);
      return;
    };
    //full product with new id returned
    if(res) {
      _.assign(that, res);
    };
    callback(err, res);
  });
}


//delete a employee
Employee.prototype.delete = function () {
  db.employees.destroySync({id: this.id});
}

module.exports = Employee;
