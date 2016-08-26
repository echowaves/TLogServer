var _ = require('lodash');

var uuid = require('uuid');
var moment = require('moment');


var Utils      = require('../utils/utils');

import * as Checkin from '../models/checkin';

var Employee   = require('../models/employee');

module.exports = require('koa-router')()

// get employee details inluding all checkins, by defauls last 100 checkins, page parameters can be passed in
.get('/employees/:activation_code/checkins', function *(next) {
  let data = new Utils().parseQueryString(this.request.querystring);
  var page_number = (data.page_number);
  var page_size = (data.page_size);

  if(page_number == null) {page_number = '0'};
  if(page_size == null)  {page_size = '100'};

  var employee =
    new Employee({ activation_code: this.params.activation_code});
  employee = yield employee.loadByActivationCode.bind(employee);
  if(employee == null) {
    this.response.status = 404;
    this.body = { "error" : 'employee not found' };
  } else {
    var checkins = yield Checkin.loadAll(employee.email, page_number, page_size);

    if(checkins.length > 0) {
      let momentCheckedInAt = moment(checkins[0].checked_in_at);
      let momentNow = moment(new Date());
      let duration = moment.duration(momentNow.diff(momentCheckedInAt));
      let days = duration.asDays();

      // delete checkin that is 7 days old but not checked out
      if(days > 7 && _.isEmpty(checkins[0].duration)) {
        yield Checkin.destroy({
          id: checkins[0].id
        });
        checkins.splice(0,1);
      }
    }



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
      var employee1 = new Employee();
      employee1.activation_code = this.params.activation_code;
      yield employee1.loadByActivationCode.bind(employee1);

      var checkin =
      yield Checkin.save({
        email: employee1.email,
        user_id: employee1.user_id,
        checked_in_at: checked_in_at,
        duration: 0,//always create with duration 0, can modify later by updating checkin
        action_code_id: action_code_id
      });
      this.response.status = 200;
      this.body = { "checkin" : checkin };
    }
  }
})

//get details of a particular checkin
.get('/employees/:activation_code/checkins/:checkin_id', function *(next) {
    var employee =
      new Employee({ activation_code: this.params.activation_code});

    yield employee.loadByActivationCode.bind(employee);
    var checkin =
    yield Checkin.load({
      id: parseInt(this.params.checkin_id)
    });

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
  employee = yield employee.loadByActivationCode.bind(employee);
  var checkin =
  yield Checkin.load({
    id: this.params.checkin_id
  });

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

      let checked_in_at   = data.checked_in_at;
      let duration        = parseInt(data.duration);
      let action_code_id  = parseInt(data.action_code_id);

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
        checkin = yield Checkin.save(checkin);

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
  yield employee.loadByActivationCode.bind(employee);
  var checkin =
  yield Checkin.load({
    id: this.params.checkin_id
  });

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
      Checkin.destroy(checkin);

      this.response.status = 200;
      this.body = { "result" : 'checkin deleted' };
    }
  }
})

.routes();
