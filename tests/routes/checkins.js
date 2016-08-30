const supertest = require('co-supertest'); // SuperAgent-driven library for testing HTTP servers
const expect    = require('chai').expect;  // BDD/TDD assertion library
require('co-mocha');                     // enable support for generators in mocha tests using co
var uuid = require('uuid');
var moment = require('moment');

process.env.NODE_ENV = 'test'
const app = require('../../app.js');
var db = require('../../consts').DB;

const request = supertest.agent(app.listen());

var assert = require('assert');

import * as User from '../../models/user';

// import * as Employee from '../../models/employee';

describe('/checkins routes testing', function() {
  var activation_code, user, token, actionCode;

  beforeEach(function *() {
    //cleanup users
    db.users.destroySync({});
    //cleanup employees
    db.employees.destroySync({});
    //cleanup checkins
    db.checkins.destroySync({});
    //cleanup actioncodes
    db.action_codes.destroySync({});

    actionCode = db.action_codes.saveSync({code: '0001', description: "this is a dummy action code just for testing"});


    var userEmail = uuid.v4() + "@example.com";
    var password = 'secret';
    user =
    yield User.save({email: userEmail, password: password});

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
    .send({email:email,name:"John Smith"})
    .end();


    // and activate the employee
    const response1 =
    yield request.post("/employees/" + response.body.employee.id + "/activation")
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .end();
    // console.log("response1.body");
    // console.log(response1.body);
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
    expect(response.body).to.contain.keys('checkin');
    expect(moment(response.body.checkin.checked_in_at).format()).to.equal(checked_in_at);
  });


  it('should not be able to create checkin with date in the future', function*() {
    const checked_in_at = moment().add(1, 's').format();
    const response =
    yield request.post('/employees/' + activation_code + '/checkins')
    .set('Content-Type', 'application/json')
    .send({checked_in_at: checked_in_at, action_code_id: 1 })
    .end();
    expect(response.status).to.equal(403, response.text);
    expect(response.body).to.contain.keys('error');
  });


  it('should not be able to create checkin with date more than 7 days in the past', function*() {
    const checked_in_at = moment().subtract(7, 'd').subtract(1, 's').format();
    const response =
    yield request.post('/employees/' + activation_code + '/checkins')
    .set('Content-Type', 'application/json')
    .send({checked_in_at: checked_in_at, action_code_id: 1 })
    .end();
    expect(response.status).to.equal(403, response.text);
    expect(response.body).to.contain.keys('error');
  });


  it('should be able to get a particuar checkin', function*() {
    const checked_in_at = moment().format();
    const response =
    yield request.post('/employees/' + activation_code + '/checkins')
    .set('Content-Type', 'application/json')
    .send({checked_in_at: checked_in_at, action_code_id: 1 })
    .end();
    const checkin_id = response.body.checkin.id;

    const response1 =
    yield request.get('/employees/' + activation_code + '/checkins/' + checkin_id)
    .set('Content-Type', 'application/json')
    .end();

    expect(response.status).to.equal(200, response.text);
    expect(response.body).to.contain.keys('checkin');
    expect(response.body.checkin.id).to.equal(response1.body.checkin.id);
    expect(response.body.checkin.email).to.equal(response1.body.checkin.email);
    expect(response.body.checkin.user_id).to.equal(response1.body.checkin.user_id);
    expect(response.body.checkin.action_code_id).to.equal(response1.body.checkin.action_code_id);
  });


  it('should not be able to get a particular checkin if it does not belong to the employee', function*() {
    const checked_in_at = moment().format();
    const response =
    yield request.post('/employees/' + activation_code + '/checkins')
    .set('Content-Type', 'application/json')
    .send({checked_in_at: checked_in_at, action_code_id: 1 })
    .end();
    const checkin_id = response.body.checkin.id;

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
    yield request.post("/employees/" + response2.body.employee.id + "/activation")
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
    const checkin_id = response.body.checkin.id;

    checked_in_at = moment().subtract(15, 'm').format();
    const duration = moment.duration(3, 'hours').asSeconds();

    const response1 =
    yield request.put('/employees/' + activation_code + '/checkins/' + checkin_id)
    .set('Content-Type', 'application/json')
    .send({checked_in_at: checked_in_at, duration: duration, action_code_id: 2 })
    .end();
    expect(response1.status).to.equal(200, response1.text);
    expect(response1.body).to.contain.keys('checkin');
    expect(moment(response1.body.checkin.checked_in_at).format()).to.equal(checked_in_at);
    expect(moment.duration(response1.body.checkin.duration).asSeconds()).to.equal(duration);
    expect(response1.body.checkin.action_code_id).to.equal(2);
  });


  it('should not be able to update more then 7 days old checkin', function*() {
    var checked_in_at = moment().format();
    const response =
    yield request.post('/employees/' + activation_code + '/checkins')
    .set('Content-Type', 'application/json')
    .send({checked_in_at: checked_in_at, action_code_id: 1 })
    .end();

    const checkin_id = response.body.checkin.id;

    db.run("update checkins set checked_in_at=$1 WHERE id=$2", [moment().subtract(8, 'd').format(), checkin_id]);

    checked_in_at = moment().subtract(15, 'm').format();
    const duration = moment.duration(3, 'hours').asMilliseconds();

    const response1 =
    yield request.put('/employees/' + activation_code + '/checkins/' + checkin_id)
    .set('Content-Type', 'application/json')
    .send({checked_in_at: checked_in_at, duration: duration, action_code_id: 2 })
    .end();
    expect(response1.status).to.equal(403, response1.text);
    expect(response1.body).to.contain.keys('error');
  });


  it('should not be able to update checkin with a future date', function*() {
    var checked_in_at = moment().format();
    const response =
    yield request.post('/employees/' + activation_code + '/checkins')
    .set('Content-Type', 'application/json')
    .send({checked_in_at: checked_in_at, action_code_id: 1 })
    .end();

    const checkin_id = response.body.checkin.id;

    checked_in_at = moment().add(15, 'm').format();
    const duration = moment.duration(3, 'hours').asMilliseconds();

    const response1 =
    yield request.put('/employees/' + activation_code + '/checkins/' + checkin_id)
    .set('Content-Type', 'application/json')
    .send({checked_in_at: checked_in_at, duration: duration, action_code_id: 2 })
    .end();
    expect(response1.status).to.equal(403, response1.text);
    expect(response1.body).to.contain.keys('error');
  });


  it('should not be able to update checkin with a more that 7 days ago date ', function*() {
    var checked_in_at = moment().format();
    const response =
    yield request.post('/employees/' + activation_code + '/checkins')
    .set('Content-Type', 'application/json')
    .send({checked_in_at: checked_in_at, action_code_id: 1 })
    .end();

    const checkin_id = response.body.checkin.id;

    checked_in_at = moment().subtract(8, 'd').format();
    const duration = moment.duration(3, 'hours').asMilliseconds();

    const response1 =
    yield request.put('/employees/' + activation_code + '/checkins/' + checkin_id)
    .set('Content-Type', 'application/json')
    .send({checked_in_at: checked_in_at, duration: duration, action_code_id: 2 })
    .end();
    expect(response1.status).to.equal(403, response1.text);
    expect(response1.body).to.contain.keys('error');
  });


  it('should not be able to update checkin belonging to other employee', function*() {
    var checked_in_at = moment().format();
    const response =
    yield request.post('/employees/' + activation_code + '/checkins')
    .set('Content-Type', 'application/json')
    .send({checked_in_at: checked_in_at, action_code_id: 1 })
    .end();
    const checkin_id = response.body.checkin.id;

    checked_in_at = moment().add(15, 'm').format();
    const duration = moment.duration(3, 'hours').asSeconds();


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
    yield request.post("/employees/" + response2.body.employee.id + "/activation")
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .end();
    const another_activation_code = response3.body.activation_code;

    const response4 =
    yield request.put('/employees/' + another_activation_code + '/checkins/' + checkin_id)
    .set('Content-Type', 'application/json')
    .send({checked_in_at: checked_in_at, duration: duration, action_code_id: 2 })
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
    const checkin_id = response.body.checkin.id;

    const response1 =
    yield request.delete('/employees/' + activation_code + '/checkins/' + checkin_id)
    .set('Content-Type', 'application/json')
    .end();
    expect(response1.status).to.equal(200, response1.text);
    expect(response1.body).to.contain.keys('result');
    expect(response1.body.result).to.equal('checkin deleted');
  });


  it('should not be able to delete checkin more than 7 days old', function*() {
    var checked_in_at = moment().format();

    const response =
    yield request.post('/employees/' + activation_code + '/checkins')
    .set('Content-Type', 'application/json')
    .send({checked_in_at: checked_in_at, action_code_id: 1 })
    .end();
    const checkin_id = response.body.checkin.id;

    db.run("update checkins set checked_in_at=$1 WHERE id=$2", [moment().subtract(8, 'd').format(), checkin_id]);

    const response1 =
    yield request.delete('/employees/' + activation_code + '/checkins/' + checkin_id)
    .set('Content-Type', 'application/json')
    .end();
    expect(response1.status).to.equal(403, response1.text);
    expect(response1.body).to.contain.keys('error');
  });


  it('should not be able to delete checkin of the wrong employee', function*() {
    var checked_in_at = moment().format();
    const response =
    yield request.post('/employees/' + activation_code + '/checkins')
    .set('Content-Type', 'application/json')
    .send({checked_in_at: checked_in_at, action_code_id: 1 })
    .end();
    const checkin_id = response.body.checkin.id;

    checked_in_at = moment().add(15, 'm').format();
    const checked_out_at = moment.duration(3, 'hours').asSeconds();


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
    yield request.post("/employees/" + response2.body.employee.id + "/activation")
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

  it('should be able to get checkins for an employee', function*() {
    // let's create 100 checkins
    for(var i = 0; i < 110; i++) {
      const checked_in_at = moment().subtract( i, 's').format();
      const response =
      yield request.post('/employees/' + activation_code + '/checkins')
      .set('Content-Type', 'application/json')
      .send({checked_in_at: checked_in_at, action_code_id: actionCode.id })
      .end();
      // const checkin_id = response.body.result.id;
    }

    // console.log(444444);
    // console.log(activation_code);

    // default page
    const response1 =
    yield request.get('/employees/' + activation_code + '/checkins')
    .set('Content-Type', 'application/json')
    .end();

    expect(response1.status).to.equal(200, response1.text);
    expect(response1.body.employee.activation_code).to.equal(activation_code);
    expect(response1.body.page_number).to.equal('0');
    expect(response1.body.page_size).to.equal('100');
    expect(response1.body.checkins.length).to.equal(100);
    expect(response1.body.checkins[0].action_code_id).to.equal(actionCode.id);
    expect(response1.body.checkins[99].action_code_id).to.equal(actionCode.id);


    const response2 =
    yield request.get('/employees/' + activation_code + "/checkins/?page_size=10&page_number=2")
    .set('Content-Type', 'application/json')
    .end();

    expect(response2.status).to.equal(200, response2.text);
    expect(response2.body.employee.activation_code).to.equal(activation_code);
    expect(response2.body.page_number).to.equal('2');
    expect(response2.body.page_size).to.equal('10');
    expect(response2.body.checkins.length).to.equal(10);
    expect(response2.body.checkins[0].action_code_id).to.equal(actionCode.id);
    expect(response2.body.checkins[9].action_code_id).to.equal(actionCode.id);

  });


  it('should not be able to get paged results checkins for an wrong employee', function*() {
    const checked_in_at = moment().format();
    const response =
    yield request.post('/employees/' + activation_code + '/checkins')
    .set('Content-Type', 'application/json')
    .send({checked_in_at: checked_in_at, action_code_id: 1 })
    .end();
    // const checkin_id = response.body.result.id;

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
    yield request.post("/employees/" + response2.body.employee.id + "/activation")
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .end();
    const another_activation_code = response3.body.activation_code;

    // can only validate against an employee that does not exists, but if the user knows a legit employee actiovationcode -- we cant prevent the user from getting all checkins
    // const response4 =
    // yield request.get('/employees/' + another_activation_code + '/checkins')
    // .set('Content-Type', 'application/json')
    // .end();
    // expect(response4.status).to.equal(404, response4.text);
    // expect(response4.body).to.contain.keys('error');
    // expect(response4.body.error).to.equal('employee not found');

    const response5 =
    yield request.get('/employees/' + 'non_existing_code' + '/checkins' )
    .set('Content-Type', 'application/json')
    // .send({checked_in_at: checked_in_at, action_code_id: 1 })
    .end();
    expect(response5.status).to.equal(404, response5.text);
    expect(response5.body).to.contain.keys('error');
    expect(response5.body.error).to.equal('employee not found');

  });


});
