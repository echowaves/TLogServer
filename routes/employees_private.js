'use strict';

var uuid = require('uuid');

var Employee   = require('../models/employee');
var EmployeesActionCode   = require('../models/employees_action_code');

module.exports = require('koa-router')()

//create a new employee
.post('/employees', function *(next) {
  let data = this.request.body;
  var employee =
    new Employee(
      { user_id: this.state.user.id,
        name: data.name,
        email: data.email,
        is_subcontractor: data.is_subcontractor
      });
  employee.save();

  this.response.status = 200;
  this.body = { "result": "employee successfully added", "employee" : employee};
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


//delete an employee
.delete('/employees/:employee_id', function *(next) {
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
    employee.delete();

    this.response.status = 200;
    this.body = { "result" : "employee deleted"};
  }
})



// get all employess for current user
.get('/employees', function *(next) {
  var employee = new Employee();
  var employees = employee.loadAllForUser(this.state.user.id);
  this.response.status = 200;
  this.body = { "employees" : employees };
})


// get employee details
.get('/employees/:employee_id', function *(next) {
  var employeeToLoad = new Employee({ id: this.params.employee_id});
  employeeToLoad.load();

  if(employeeToLoad.user_id != this.state.user.id) {
    this.response.status = 403;
    this.body = { "error" : "the employee does not belong to currenty authenticated user"};
  } else {
    this.response.status = 200;
    this.body = { "result" : employeeToLoad };
  }
})

// update an employee
.put('/employees/:employee_id', function *(next) {
  let data = this.request.body;
  var employeeToLoad = new Employee({ id: this.params.employee_id});
  employeeToLoad.load();

  if(employeeToLoad.user_id != this.state.user.id) {
    this.response.status = 403;
    this.body = { "error" : "the employee does not belong to currenty authenticated user"};
  } else {
    var employee =
      new Employee(
        { id: this.params.employee_id,
          user_id: this.state.user.id,
          name: data.name,
          email: data.email,
          is_subcontractor: data.is_subcontractor
        });
    employee.save();

    this.response.status = 200;
    this.body = { "result": "employee successfully updated"};
  }


})



//employee specific action codes
// add action code to employee
.post('/employees/:employee_id/actioncodes/:action_code_id', function *(next) {
    var employeesActionCode =
      new EmployeesActionCode(
        {
          employee_id: this.params.employee_id,
          action_code_id: this.params.action_code_id
        });
    employeesActionCode.save();

    this.response.status = 200;
    this.body = { "result": "employeesActionCode successfully created"};
})

// delete action code from employee
.delete('/employees/:employee_id/actioncodes/:action_code_id', function *(next) {
  var employeesActionCode =
    new EmployeesActionCode(
      {
        employee_id: this.params.employee_id,
        action_code_id: this.params.action_code_id
      });
  employeesActionCode.delete();

  this.response.status = 200;
  this.body = { "result": "employeesActionCode successfully deleted"};
})



.routes();
