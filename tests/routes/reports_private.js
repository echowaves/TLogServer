'use strict';

const supertest = require('co-supertest'); // SuperAgent-driven library for testing HTTP servers
const expect    = require('chai').expect;  // BDD/TDD assertion library
require('co-mocha');                     // enable support for generators in mocha tests using co

var moment = require('moment');


process.env.NODE_ENV = 'test'
const app = require('../../app.js');
var db = require('../../consts').DB;

const request = supertest.agent(app.listen());

var assert = require('assert');
var User   = require('../../models/user'),
Employee   = require('../../models/employee'),
ActionCode = require('../../models/action_code'),
Checkin    = require('../../models/checkin');

describe('/reports routes testing', function() {
  var activation_code, user, token;
  var actionCodes = new Array(5);
  var employees = new Array(5);

  before(function *() {
    //cleanup users
    db.users.destroySync({});
    //cleanup employees
    db.employees.destroySync({});
    //cleanup checkins
    db.checkins.destroySync({});
    //cleanup actioncodes
    db.action_codes.destroySync({});

    for(var i = 0; i < actionCodes.length; i++) {
      actionCodes[i] = db.action_codes.saveSync({code: '000'+i, description: "this is a dummy action code"+i+" just for testing"});
    }


    var userEmail = "user@example.com";
    var password = 'secret';
    user = new User({email: userEmail, password: password});
    user.save();

    //authenticate user and obtain a token
    const resp =
    yield request.post('/auth')
    .set('Content-Type', 'application/json')
    .send({email: userEmail, password: password })
    .end();
    token = resp.body.token;

    // add few employees    var employeeEmail = uuid.v4() + "@example.com";
    for(var i=0; i<employees.length; i++) {
      // add an employee
      const response =
      yield request.post('/employees')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        email: "employee" + i + "@example.com",
        name: "employee" + i + " name"})
      .end();
      employees[i] = response.body.employee;

      // and activate the employee
      const response1 =
      yield request.post("/employees/" + response.body.employee.id + "/activation")
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .end();

      employees[i].activation_code = response1.body.activation_code;
      // console.log(employees[i]);
    }

    // add few checkins
    for(var i=0; i<employees.length; i++) {
      for(var j=0; j<actionCodes.length; j++) {
        var date = moment([2010 + i, j, 15]);

        const response =
        yield request.post('/employees/' + employees[i].activation_code + '/checkins')
        .set('Content-Type', 'application/json')
        .send({checked_in_at: date, action_code_id: actionCodes[j].id })
        .end();

        const response1 =
        yield request.put('/employees/' + employees[i].activation_code + '/checkins/' + response.body.checkin.id)
        .set('Content-Type', 'application/json')
        .send({checked_in_at: date, action_code_id: actionCodes[j].id, duration: i * j * 60 * 60 + 125})
        .end();
      }
    }
    // console.log("done");
  });

  it('should not be able to get years for unathenticated user', function*() {
    var response =
    yield request.get('/reports/years')
    .set('Content-Type', 'application/json')
    .end();
    expect(response.status).to.equal(401, response.text);
  });

  it('should be able to get years for user', function*() {
    var response =
    yield request.get('/reports/years')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .end();
    expect(response.status).to.equal(200, response.text);
    expect(response.body.years.length).to.equal(5);
    expect(response.body.years[0]).to.contain.keys('date_part');
  });


  it('should not be able to get months for unathenticated user', function*() {
    var response =
    yield request.get('/reports/months')
    .set('Content-Type', 'application/json')
    .end();
    expect(response.status).to.equal(401, response.text);
  });



  it('should be able to get months for user and year', function*() {
    var response =
    yield request.get('/reports/months/2014')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .end();
    expect(response.status).to.equal(200, response.text);
    expect(response.body.months.length).to.equal(5);
    expect(response.body.months[0]).to.contain.keys('date_part');
  });

});
