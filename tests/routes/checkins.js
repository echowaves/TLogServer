'use strict';

const supertest = require('co-supertest'); // SuperAgent-driven library for testing HTTP servers
const expect    = require('chai').expect;  // BDD/TDD assertion library
require('co-mocha');                     // enable support for generators in mocha tests using co
var uuid = require('uuid');
var moment = require('moment');

let parse = require('co-body');

process.env.NODE_ENV = 'test'
const app = require('../../app.js');
var db = require('../../consts').DB;

const request = supertest.agent(app.listen());

var assert = require('assert');
var User   = require('../../models/user'),
    Employee = require('../../models/employee');

describe('/checkins routes testing', function() {
  var activation_code, user, token;

  beforeEach(function *() {
    //cleanup users
    db.users.destroySync({});
    //cleanup employees
    db.employees.destroySync({});
    //cleanup checkins
    db.checkins.destroySync({});

    var userEmail = uuid.v4() + "@example.com";
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

    var email = uuid.v4() + "@example.com";

    // add an employee
    const response =
      yield request.post('/employees')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .send({email: email, name: "John Smith"})
    .end();

    // and activate the employee
    const response1 =
      yield request.post("/employees/" + response.body.id + "/activation")
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .end();
    activation_code = response1.body.activation_code;

  });

  it('should not be able to create checkin with missing parameters', function*() {
    var response =
      yield request.post('/employees/' + activation_code + '/checkins')
    .set('Content-Type', 'application/json')
    .end();
    expect(response.status).to.equal(400, response.text);
    expect(response.body).to.contain.keys('error');
    expect(response.body.error).to.equal('parameters missing');

    response =
      yield request.post('/employees/' + activation_code + '/checkins')
    .set('Content-Type', 'application/json')
    .send({checked_in_at: moment().toDate() })
    .end();
    expect(response.status).to.equal(400, response.text);
    expect(response.body).to.contain.keys('error');
    expect(response.body.error).to.equal('parameters missing');

    response =
      yield request.post('/employees/' + activation_code + '/checkins')
    .set('Content-Type', 'application/json')
    .send({action_code_id: 1 })
    .end();
    expect(response.status).to.equal(400, response.text);
    expect(response.body).to.contain.keys('error');
    expect(response.body.error).to.equal('parameters missing');

  });


  it('should be able to create checkin', function*() {
    const checked_in_at = moment().format();
    const response =
      yield request.post('/employees/' + activation_code + '/checkins')
    .set('Content-Type', 'application/json')
    .send({checked_in_at: checked_in_at, action_code_id: 1 })
    .end();
    expect(response.status).to.equal(200, response.text);
    expect(response.body).to.contain.keys('result');
    expect(moment(response.body.result.checked_in_at).format()).to.equal(checked_in_at);
  });



  it('should be able to get a particuar checkin', function*() {
    const checked_in_at = moment().format();
    const response =
      yield request.post('/employees/' + activation_code + '/checkins')
    .set('Content-Type', 'application/json')
    .send({checked_in_at: checked_in_at, action_code_id: 1 })
    .end();
    const checkin_id = response.body.result.id;

    const response1 =
      yield request.get('/employees/' + activation_code + '/checkins/' + checkin_id)
    .set('Content-Type', 'application/json')
    .send({checked_in_at: checked_in_at, action_code_id: 1 })
    .end();
    expect(response.status).to.equal(200, response.text);
    expect(response.body).to.contain.keys('result');
    expect(response.body.result.id).to.equal(response1.body.result.id);
    expect(response.body.result.email).to.equal(response1.body.result.email);
    expect(response.body.result.user_id).to.equal(response1.body.result.user_id);
    expect(response.body.result.action_code_id).to.equal(response1.body.result.action_code_id);
  });


  it('should not be able to get a particular checkin if it does not belong to the employee', function*() {
    const checked_in_at = moment().format();
    const response =
      yield request.post('/employees/' + activation_code + '/checkins')
    .set('Content-Type', 'application/json')
    .send({checked_in_at: checked_in_at, action_code_id: 1 })
    .end();
    const checkin_id = response.body.result.id;

    const email = uuid.v4() + "@example.com";
    // add anohter employee
    const response2 =
      yield request.post('/employees')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .send({email: email, name: "John Smith"})
    .end();

    // and activate the employee
    const response3 =
      yield request.post("/employees/" + response2.body.id + "/activation")
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .end();
    const another_activation_code = response3.body.activation_code;


    const response4 =
      yield request.get('/employees/' + another_activation_code + '/checkins/' + checkin_id)
    .set('Content-Type', 'application/json')
    .send({checked_in_at: checked_in_at, action_code_id: 1 })
    .end();
    expect(response4.status).to.equal(404, response4.text);
    expect(response4.body).to.contain.keys('error');
    expect(response4.body.error).to.equal('checkin not found');

    const response5 =
      yield request.get('/employees/' + 'non_existing_code' + '/checkins/' + checkin_id)
    .set('Content-Type', 'application/json')
    .send({checked_in_at: checked_in_at, action_code_id: 1 })
    .end();
    expect(response5.status).to.equal(404, response5.text);
    expect(response5.body).to.contain.keys('error');
    expect(response5.body.error).to.equal('checkin not found');
  });


  it('should be able to update checkin', function*() {
    var checked_in_at = moment().format();
    const response =
      yield request.post('/employees/' + activation_code + '/checkins')
    .set('Content-Type', 'application/json')
    .send({checked_in_at: checked_in_at, action_code_id: 1 })
    .end();
    const checkin_id = response.body.result.id;

    checked_in_at = moment().add(15, 'm').format();
    const checked_out_at = moment().add(3, 'h').format();

    const response1 =
      yield request.put('/employees/' + activation_code + '/checkins/' + checkin_id)
    .set('Content-Type', 'application/json')
    .send({checked_in_at: checked_in_at, checked_out_at: checked_out_at, action_code_id: 2 })
    .end();


    expect(response1.status).to.equal(200, response1.text);
    expect(response1.body).to.contain.keys('result');
    expect(moment(response1.body.result.checked_in_at).format()).to.equal(checked_in_at);
    expect(moment(response1.body.result.checked_out_at).format()).to.equal(checked_out_at);
    expect(response1.body.result.action_code_id).to.equal(2);

  });


  it('should not be able to update checkin belonging to other employee', function*() {
    var checked_in_at = moment().format();
    const response =
      yield request.post('/employees/' + activation_code + '/checkins')
    .set('Content-Type', 'application/json')
    .send({checked_in_at: checked_in_at, action_code_id: 1 })
    .end();
    const checkin_id = response.body.result.id;

    checked_in_at = moment().add(15, 'm').format();
    const checked_out_at = moment().add(3, 'h').format();


    const email = uuid.v4() + "@example.com";
    // add anohter employee
    const response2 =
      yield request.post('/employees')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .send({email: email, name: "John Smith"})
    .end();

    // and activate the employee
    const response3 =
      yield request.post("/employees/" + response2.body.id + "/activation")
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .end();
    const another_activation_code = response3.body.activation_code;



    const response4 =
      yield request.put('/employees/' + another_activation_code + '/checkins/' + checkin_id)
    .set('Content-Type', 'application/json')
    .send({checked_in_at: checked_in_at, checked_out_at: checked_out_at, action_code_id: 2 })
    .end();
    expect(response4.status).to.equal(404, response4.text);
    expect(response4.body).to.contain.keys('error');
    expect(response4.body.error).to.equal('checkin not found');

    const response5 =
    yield request.put('/employees/' + 'non_existing_code' + '/checkins/' + checkin_id)
    .set('Content-Type', 'application/json')
    .send({checked_in_at: checked_in_at, action_code_id: 1 })
    .end();
    expect(response5.status).to.equal(404, response5.text);
    expect(response5.body).to.contain.keys('error');
    expect(response5.body.error).to.equal('checkin not found');

  });


  it('should be able to delete checkin', function*() {
    var checked_in_at = moment().format();
    const response =
      yield request.post('/employees/' + activation_code + '/checkins')
    .set('Content-Type', 'application/json')
    .send({checked_in_at: checked_in_at, action_code_id: 1 })
    .end();
    const checkin_id = response.body.result.id;


    const response1 =
      yield request.delete('/employees/' + activation_code + '/checkins/' + checkin_id)
    .set('Content-Type', 'application/json')
    .end();
    expect(response1.status).to.equal(200, response1.text);
    expect(response1.body).to.contain.keys('result');
    expect(response1.body.result).to.equal('checkin deleted');
  });



  it('should not be able to delete checkin of the wrong employee', function*() {
    var checked_in_at = moment().format();
    const response =
      yield request.post('/employees/' + activation_code + '/checkins')
    .set('Content-Type', 'application/json')
    .send({checked_in_at: checked_in_at, action_code_id: 1 })
    .end();
    const checkin_id = response.body.result.id;

    checked_in_at = moment().add(15, 'm').format();
    const checked_out_at = moment().add(3, 'h').format();


    const email = uuid.v4() + "@example.com";
    // add anohter employee
    const response2 =
      yield request.post('/employees')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .send({email: email, name: "John Smith"})
    .end();

    // and activate the employee
    const response3 =
      yield request.post("/employees/" + response2.body.id + "/activation")
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .end();
    const another_activation_code = response3.body.activation_code;



    const response4 =
      yield request.delete('/employees/' + another_activation_code + '/checkins/' + checkin_id)
    .set('Content-Type', 'application/json')
    .end();
    expect(response4.status).to.equal(404, response4.text);
    expect(response4.body).to.contain.keys('error');
    expect(response4.body.error).to.equal('checkin not found');

    const response5 =
    yield request.delete('/employees/' + 'non_existing_code' + '/checkins/' + checkin_id)
    .set('Content-Type', 'application/json')
    .end();
    expect(response5.status).to.equal(404, response5.text);
    expect(response5.body).to.contain.keys('error');
    expect(response5.body.error).to.equal('checkin not found');

  });


  it('should be able to get all (first page by default) checkins for an employee', function*() {
    // let's create 100 checkins
    for(var i = 0; i < 110; i++) {
      const checked_in_at = moment().add( i, 's').format();

      const response =
        yield request.post('/employees/' + activation_code + '/checkins')
      .set('Content-Type', 'application/json')
      .send({checked_in_at: checked_in_at, action_code_id: i })
      .end();
      const checkin_id = response.body.result.id;
    }

    // default page
    const response1 =
      yield request.get('/employees/' + activation_code + '/checkins')
    .set('Content-Type', 'application/json')
    .end();

    expect(response1.status).to.equal(200, response1.text);
    expect(response1.body.employee.activation_code).to.equal(activation_code);
    expect(response1.body.page_number).to.equal(0);
    expect(response1.body.page_size).to.equal(100);
    expect(response1.body.checkins.length).to.equal(100);
    expect(response1.body.checkins[0].action_code_id).to.equal(109);
    expect(response1.body.checkins[99].action_code_id).to.equal(10);


    const response2 =
      yield request.get('/employees/' + activation_code + '/checkins')
    .set('Content-Type', 'application/json')
    .send({page_number: 0, page_size: 10})
    .end();

    expect(response2.status).to.equal(200, response2.text);

  console.log(response1.body.employee);
  console.log(response1.body.checkins);
  console.log(response1.body.page_number);
  console.log(response1.body.page_size);

    expect(response1.body).to.contain.keys('employee');
    expect(response1.body).to.contain.keys('checkins');
    expect(response1.body).to.contain.keys('page_number');
    expect(response1.body).to.contain.keys('page_size');
    // expect(response1.body.result).to.equal('checkin deleted');


  })
  // it('should be able to get paged results checkins for an employee');


});
