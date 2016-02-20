'use strict';
let parse = require('co-body');
var uuid = require('uuid');

var Employee   = require('../models/employee');

module.exports = require('koa-router')()

//create a new employee
.post('/employees', function *(next) {
  let data = yield parse.json(this);
  var employee =
    new Employee(
      { user_id: this.state.user.id,
        name: data.name,
        email: data.email
      });
  employee.save();

  this.response.status = 200;
  this.body = { "result": "employee successfully added", "id" : employee.id};
})

//activate an employee (create activation)
.post('/employees/:employee_id/activation', function *(next) {
  var employeeToLoad =
    new Employee({ id: this.params.employee_id});
  employeeToLoad.load();

  // check that the employee exists and belongs to the user
  if(employeeToLoad.user_id != this.state.user.id) {
    this.response.status = 403;
    this.body = { "error" : "the employee does not belong to currenty authenticated user"};
  } else {
    const activation_code = uuid.v4();
    var employee =
      new Employee(
        { id: this.params.employee_id,
          user_id: this.state.user.id,
          activation_code: activation_code
        });
    employee.save();

    this.response.status = 200;
    this.body = { "activation_code" : employee.activation_code};
  }
})


//deactivate an employee
.delete('/employees/:employee_id/activation', function *(next) {
  var employeeToLoad =
    new Employee({ id: this.params.employee_id});
  employeeToLoad.load();
  // check that the employee exists and belongs to the user
  if(employeeToLoad.user_id != this.state.user.id) {
    this.response.status = 403;
    this.body = { "error" : "the employee does not belong to currenty authenticated user"};
  } else {
    var employee =
      new Employee(
        { id: this.params.employee_id,
          user_id: this.state.user.id,
          activation_code: null
        });
    employee.save();

    this.response.status = 200;
    this.body = { "result" : "employee deactivated"};
  }
})


// get all employess for current user
.get('/employees', function *(next) {
  var employee = new Employee();
  var employees = employee.loadAllForUser(this.state.user.id);
  this.response.status = 200;
  this.body = { "results" : employees };
  yield next;
})


// get  employess details for current user
.get('/employees/:id', function *(next) {
  var token = this.request.header.authorization.replace("Bearer ", "");
  this.response.status = 200;
  this.body = this.state.user;
  yield next;
})

.routes();
