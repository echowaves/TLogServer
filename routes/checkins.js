'use strict';
let parse = require('co-body');
var uuid = require('uuid');

var Employee   = require('../models/employee');

module.exports = require('koa-router')()

// get employee details inluding all checkins, by defauls last 100 checkins, page parameters can be passed in
.get('/employees/:activation_code/checkins', function *(next) {
  var employeeToLoad = new Employee({ activation_code: this.params.activation_code});
  employeeToLoad.load();

  if(employeeToLoad.user_id != this.state.user.id) {
    this.response.status = 403;
    this.body = { "error" : "the employee does not belong to currenty authenticated user"};
  } else {
    this.response.status = 200;
    this.body = { "result" : employeeToLoad };
  }
})

//create a checkin, checkin time must be passed as a parameter
.post('/employees/:activation_code/checkins', function *(next) {
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

//update checkin which includes checkout, checkout time must be passed as a parameter
.put('/employees/:activation_code/checkins/:checkin_id', function *(next) {
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

// delete checkin
.delete('/employees/:activation_code/checkins/:checkin_id', function *(next) {
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

.routes();
