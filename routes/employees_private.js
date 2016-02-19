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

//activate an employee
.put('/employees/:employee_id/activation', function *(next) {
  console.log("::::::::::::::::::::::::::::::::::::::::::::::::::");
  // console.log(ctx.params.employee_id);
  // const activation_code = uuid.v4();
// console.log(activation_code);
  // var employee =
  //   new Employee(
  //     { id: ctx.params.employee_id,
  //       user_id: this.state.user.id,
  //       activation_code: activation_code
  //     });
  // employee.save();


  this.response.status = 200;
  this.body = { "activation_code" : "activation_code"};
  // yield next;
})
//deactivate an employee
.delete('/employees/:id/activation', function *(next) {
  var token = this.request.header.authorization.replace("Bearer ", "");
  this.response.status = 200;
  this.body = this.state.user;
  yield next;
})


// get all employess for current user
.get('/employees', function *(next) {
  var token = this.request.header.authorization.replace("Bearer ", "");
  this.response.status = 200;
  this.body = this.state.user;
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
