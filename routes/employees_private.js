'use strict';
let parse = require('co-body');

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
  this.body = { "result": 'employee successfully added'};
})

//activate an employee
.put('/employees/:id/activation', function *(next) {
  var token = this.request.header.authorization.replace("Bearer ", "");
  this.response.status = 200;
  this.body = this.state.user;
  yield next;
})
//deactivate an employee
.delete('/employees/:id/activation', function *(next) {
  var token = this.request.header.authorization.replace("Bearer ", "");
  this.response.status = 200;
  this.body = this.state.user;
  yield next;
})



//update an employee
.put('/employees', function *(next) {
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

//delete an employee
.delete('/employees', function *(next) {

  var token = this.request.header.authorization.replace("Bearer ", "");
  this.response.status = 200;
  this.body = this.state.user;
  yield next;
})

.routes();
