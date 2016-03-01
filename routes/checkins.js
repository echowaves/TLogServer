'use strict';
let parse = require('co-body');
var uuid = require('uuid');

var Employee   = require('../models/employee');
var Checkin    = require('../models/checkin');

module.exports = require('koa-router')()

// get employee details inluding all checkins, by defauls last 100 checkins, page parameters can be passed in
.get('/employees/:activation_code/checkins', function *(next) {
  let data = yield parse.json(this);
  var page_number = data.page_number;
  var page_size = data.page_size;

  if(page_number == null) {page_number = 0};
  if(page_size == null) {page_size = 100};

  var employee =
    new Employee({ activation_code: this.params.activation_code});
  employee = employee.loadByActivationCode();

  if(employee == null) {
    this.response.status = 404;
    this.body = { "error" : 'employee not found' };
  } else {

    var checkins = new Checkin({email: employee.email}).loadAll(page_number, page_size);

    this.response.status = 200;
    this.body = {
        employee :employee,
        page_number: page_number,
        page_size: page_size,
        checkins: checkins };
  }
})

//create a checkin, checkin time must be passed as a parameter as well as action code
.post('/employees/:activation_code/checkins', function *(next) {
  let data = yield parse.json(this);

  let checked_in_at = data.checked_in_at;
  let action_code_id = data.action_code_id;

  if(checked_in_at == null || action_code_id == null) {
    this.response.status = 400;
    this.body = { "error" : 'parameters missing'};
  } else {
    var employee =
      new Employee({ activation_code: this.params.activation_code});
    employee.loadByActivationCode();

    var checkin = new Checkin(
      {
        email: employee.email,
        user_id: employee.user_id,
        checked_in_at: checked_in_at,
        // checked_out_at: moment(checked_in_at).add(3, 'h'),
        action_code_id: action_code_id
      }
    );
    checkin.save();

    this.response.status = 200;
    this.body = { "result" : checkin };
  }
})

//get details of a particular checkin
.get('/employees/:activation_code/checkins/:checkin_id', function *(next) {
    var employee =
      new Employee({ activation_code: this.params.activation_code});
    employee.loadByActivationCode();

    var checkin = new Checkin(
      {
        id: this.params.checkin_id
      }
    );
    checkin.load();

    if(employee == null || employee.email != checkin.email || employee.user_id != checkin.user_id) {
      this.response.status = 404;
      this.body = { "error" : 'checkin not found' };
    } else {
      this.response.status = 200;
      this.body = { "result" : checkin };
    }

})

//update checkin which includes checkout, checkout time must be passed as a parameter
.put('/employees/:activation_code/checkins/:checkin_id', function *(next) {
  var employee =
    new Employee({ activation_code: this.params.activation_code});
  employee.loadByActivationCode();

  var checkin = new Checkin(
    {
      id: this.params.checkin_id
    }
  );
  checkin.load();
  if(employee == null || employee.email != checkin.email || employee.user_id != checkin.user_id) {
    this.response.status = 404;
    this.body = { "error" : 'checkin not found' };
  } else {

    let data = yield parse.json(this);

    let checked_in_at = data.checked_in_at;
    let checked_out_at = data.checked_out_at;
    let action_code_id = data.action_code_id;


    var checkin = new Checkin(
      {
        email: employee.email,
        user_id: employee.user_id,
        checked_in_at: checked_in_at,
        checked_out_at: checked_out_at,
        action_code_id: action_code_id
      }
    );
    checkin.save();

    this.response.status = 200;
    this.body = { "result" : checkin };
  }
})

// delete checkin
.delete('/employees/:activation_code/checkins/:checkin_id', function *(next) {
  var employee =
    new Employee({ activation_code: this.params.activation_code});
  employee.loadByActivationCode();

  var checkin = new Checkin(
    {
      id: this.params.checkin_id
    }
  );
  checkin.load();

  if(employee == null || employee.email != checkin.email || employee.user_id != checkin.user_id) {
    this.response.status = 404;
    this.body = { "error" : 'checkin not found' };
  } else {

    checkin.delete();

    this.response.status = 200;
    this.body = { "result" : 'checkin deleted' };
  }
})

.routes();
