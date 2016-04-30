'use strict';

var uuid = require('uuid');
var moment = require('moment');

var Utils      = require('../utils/utils');

var Checkin    = require('../models/checkin');
var Employee   = require('../models/employee');

module.exports = require('koa-router')()

// get employee details inluding all checkins, by defauls last 100 checkins, page parameters can be passed in
.get('/employees/:activation_code/checkins', function *(next) {
  let data = new Utils().parseQueryString(this.request.querystring);
  var page_number = data.page_number;
  var page_size = data.page_size;

  if(page_number == null) {page_number = '0'};
  if(page_size == null) {page_size = '100'};

  var employee =
    new Employee({ activation_code: this.params.activation_code});
  employee = employee.loadByActivationCode();

  if(employee == null) {
    this.response.status = 404;
    this.body = { "error" : 'employee not found' };
  } else {

    var checkinTemplate = new Checkin({email: employee.email});
    var checkins = checkinTemplate.loadAll(page_number, page_size);

    this.response.status = 200;
    this.body = {
        employee :employee,
        page_number: page_number,
        page_size: page_size,
        checkins: checkins };
  }
})

//create a checkin, checkin time must be passed as a parameter as well as action code, duration can only be updated
.post('/employees/:activation_code/checkins', function *(next) {
  let data = this.request.body;

  let checked_in_at = data.checked_in_at;
  let action_code_id = data.action_code_id;

  if(checked_in_at == null || action_code_id == null) {
    this.response.status = 400;
    this.body = { "error" : 'parameters missing'};
  } else {
    let momentNow = moment(new Date());
    let momentCheckedInAt = moment(checked_in_at);
    var duration = moment.duration(momentNow.diff(momentCheckedInAt));
    var days = duration.asDays();

    if(days < 0 || days > 7) {
      this.response.status = 403;
      this.body = { "error" : 'unable to create more then 7 days old checkin'};
    } else {
      var employee =
        new Employee({ activation_code: this.params.activation_code});
      employee.loadByActivationCode();

      var checkin = new Checkin(
        {
          email: employee.email,
          user_id: employee.user_id,
          checked_in_at: checked_in_at,
          duration: 0,//always create with duration 0, can modify later by updating checkin
          action_code_id: action_code_id
        }
      );
      checkin.save();
      this.response.status = 200;
      this.body = { "checkin" : checkin };
    }
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
      this.body = { "checkin" : checkin };
    }
})

//update checkin which includes checkout, duration must be passed as a parameter
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
    let momentNow = moment(new Date());
    let momentCheckedInAt = moment(checkin.checked_in_at);
    var duration = moment.duration(momentNow.diff(momentCheckedInAt));
    var days = duration.asDays();

    if(days > 7) {
      this.response.status = 403;
      this.body = { "error" : 'unable to update more then 7 days old checkin'};
    } else {

      let data = this.request.body;

      let checked_in_at = data.checked_in_at;
      let duration = data.duration;
      let action_code_id = data.action_code_id;

      checkin.checked_in_at = checked_in_at;
      checkin.duration = duration;
      checkin.action_code_id = action_code_id;

      momentCheckedInAt = moment(checkin.checked_in_at);
      duration = moment.duration(momentNow.diff(momentCheckedInAt));
      days = duration.asDays();

      if(days < 0 || days > 7) {
        this.response.status = 403;
        this.body = { "error" : 'unable to update to more then 7 days old checkin'};
      } else {
        checkin.save();

        this.response.status = 200;
        this.body = { "checkin" : checkin };
      }
    }
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

    let momentNow = moment(new Date());
    let momentCheckedInAt = moment(checkin.checked_in_at);
    var duration = moment.duration(momentNow.diff(momentCheckedInAt));
    var days = duration.asDays();

    if(days > 7) {
      this.response.status = 403;
      this.body = { "error" : 'unable to delete more then 7 days old checkin'};
    } else {
      checkin.delete();
      this.response.status = 200;
      this.body = { "result" : 'checkin deleted' };
    }
  }
})

.routes();
