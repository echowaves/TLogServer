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
      console.log("error Employee.prototype.load");
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
Employee.prototype.loadAllForSubcontractor = function (callback) {
  db.employees.find({subcontractor_id:this.subcontractor_id}, function(err, foundEmployees) {
    if(err) {
      console.log("error Employee.prototype.loadAllForSubcontractor");
      console.log(err);
      callback(err, res);
      return;
    };
    var employees = [];
    foundEmployees.forEach(function(item){
      var employee = new Employee();
      _.assign(employee, item);
      employees.push(employee);
    });
    callback(err, employees);
  });
}


//load all employees for user
Employee.prototype.loadAllForUser = function (user_id, callback) {
  db.employees.find({user_id:user_id}, {order:"name asc"}, function(err, foundEmployees) {
    if(err) {
      console.log("error Employee.prototype.loadAllForUser");
      console.log(err);
      callback(err, res);
      return;
    };
    var employees = [];
    foundEmployees.forEach(function(item){
      var employee = new Employee();
      _.assign(employee, item);
      employees.push(employee);
    });
    callback(err, employees);
  });
}

// upsert employee
Employee.prototype.save = function (callback) {
  var that = this;
  db.employees.save(that, function(err, res) {
    if(err) {
      console.log("error Employee.prototype.save");
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
      console.log("error Employee.prototype.update");
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
