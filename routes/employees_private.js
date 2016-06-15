'use strict';

var uuid = require('uuid');

var Employee   = require('../models/employee');
var EmployeesActionCode   = require('../models/employees_action_code');
var Subcontractor   = require('../models/subcontractor');

var SEND_GRID_API_USER     = require('../consts').SEND_GRID_API_USER;
var SEND_GRID_API_PASSWORD = require('../consts').SEND_GRID_API_PASSWORD;

var sendgrid  = require('sendgrid')(SEND_GRID_API_USER, SEND_GRID_API_PASSWORD);

var TL_HOST = require('../consts').TL_HOST;
var TL_TEST_MODE = require('../consts').TL_TEST_MODE;

module.exports = require('koa-router')()

//create a new employee
.post('/employees', function *(next) {
  let data = this.request.body;
  var employee =
    new Employee(
      { user_id: this.state.user.id,
        name: data.name,
        email: data.email,
        subcontractor_id: data.subcontractor_id
      });
  yield employee.save.bind(employee);

  this.response.status = 200;
  this.body = { "result": "employee successfully added", "employee" : employee};
})


//activate an employee (create activation)
.post('/employees/:employee_id/activation', function *(next) {
  var employee =
    new Employee({ id: parseInt(this.params.employee_id)});

  yield employee.load.bind(employee);

  // check that the employee exists and belongs to the user
  if(employee.user_id != this.state.user.id) {
    this.response.status = 403;
    this.body = { "error" : "the employee does not belong to currenty authenticated user"};
  } else {
    const activation_code = uuid.v4();
    var employee1 =
      new Employee(
        { id: parseInt(this.params.employee_id),
          activation_code: activation_code
        });
    // employee.activation_code = activation_code;
    yield employee1.update.bind(employee1);

    var email = new sendgrid.Email();
    email.addTo(employee.email);
    email.subject = "TLog Activation";
    email.from = 'info@tlog.us';
    email.text = "Install TLog application and Sign in on your smart phone by clickin on the following link: " + TL_HOST + "/public/mobile_employee.html?activation_code=" + employee1.activation_code ;
    email.html = "<!DOCTYPE html><html><body>Install TLog application and <a href='" + TL_HOST + "/public/mobile_employee.html?activation_code=" + employee1.activation_code + "' style='background-color:#00C333;border:1px solid #00C333;border-radius:3px;color:#ffffff;display:inline-block;font-family:sans-serif;font-size:16px;line-height:44px;text-align:center;text-decoration:none;width:150px;-webkit-text-size-adjust:none;mso-hide:all;'>Sign In</a> on your smart phone.</body></html>";


    if(TL_TEST_MODE == false) {// only send email in non test mode
      sendgrid.send(email, function(err, json) {
        if(err) {
          console.log("error sending activation email through sendgrid to: " + employee.email);
          console.log(err);
          console.log(err);
          console.log(json);
        } else {
          console.log("successfully sent activation email to: " + employee.email);
        }
      });
    };

    this.response.status = 200;
    this.body = { "activation_code" : employee1.activation_code};
  }
})


//deactivate an employee
.delete('/employees/:employee_id/activation', function *(next) {
  var employeeToLoad =
    new Employee({ id: parseInt(this.params.employee_id)});
  yield employeeToLoad.load.bind(employeeToLoad);

  // check that the employee exists and belongs to the user
  if(employeeToLoad.user_id != this.state.user.id) {
    this.response.status = 403;
    this.body = { "error" : "the employee does not belong to currenty authenticated user"};
  } else {
    var employee =
      new Employee(
        { id: parseInt(this.params.employee_id),
          user_id: this.state.user.id,
          activation_code: null
        });
    yield employee.update.bind(employee);

    this.response.status = 200;
    this.body = { "result" : "employee deactivated"};
  }
})


//delete an employee
.delete('/employees/:employee_id', function *(next) {
  var employeeToLoad =
    new Employee({ id: this.params.employee_id});
  employeeToLoad.load.bind(employeeToLoad);
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
  employeeToLoad.load.bind(employeeToLoad);

  if(employeeToLoad.user_id != this.state.user.id) {
    this.response.status = 403;
    this.body = { "error" : "the employee does not belong to currenty authenticated user"};
  } else {
    this.response.status = 200;
    this.body = { "result" : "employee loaded", "employee" : employeeToLoad };
  }
})

// update an employee
.put('/employees/:employee_id', function *(next) {
  let data = this.request.body;
  var employee = new Employee({ id: parseInt(this.params.employee_id)});
  employee.load.bind(employee);

  if(employee.user_id != this.state.user.id) {
    this.response.status = 403;
    this.body = { "error" : "the employee does not belong to currenty authenticated user"};
  } else {
    employee.user_id = this.state.user.id;
    employee.name =  data.name;
    employee.email = data.email;
    employee.update();

    this.response.status = 200;
    this.body = { "result": "employee successfully updated"};
  }
})


// add employee to subcontractor
.post('/employees/:employee_id/subcontractor/:subcontractor_id', function *(next) {
  var employee = new Employee({ id: this.params.employee_id});
  employee.load.bind(employee);

  if(employee.user_id != this.state.user.id) {
    this.response.status = 403;
    this.body = { "error" : "the employee does not belong to currenty authenticated user"};
  } else {
    employee.subcontractor_id = this.params.subcontractor_id;
    yield employee.save.bind(employee);

    this.response.status = 200;
    this.body = { "result": "employee successfully added to subcontractor"};
  }
})

// delete employee from a subcontractor
.delete('/employees/:employee_id/subcontractor', function *(next) {
  var employee = new Employee({ id: this.params.employee_id});
  employee.load.bind(employee);

  if(employee.user_id != this.state.user.id) {
    this.response.status = 403;
    this.body = { "error" : "the employee does not belong to currenty authenticated user"};
  } else {
    employee.subcontractor_id = null;
    yield employee.save.bind(employee);

    this.response.status = 200;
    this.body = { "result": "employee successfully deleted from subcontractor"};
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
