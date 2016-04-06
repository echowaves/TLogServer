'use strict';

const supertest = require('co-supertest'); // SuperAgent-driven library for testing HTTP servers
const expect    = require('chai').expect;  // BDD/TDD assertion library
require('co-mocha');                     // enable support for generators in mocha tests using co
var uuid = require('uuid');
var User   = require('../../models/user');


process.env.NODE_ENV = 'test'
const app = require('../../app.js');
var db = require('../../consts').DB;

const request = supertest.agent(app.listen());

var assert = require('assert'),
    ActionCode   = require('../../models/action_code');


describe('/actioncodes route testing', function() {

  beforeEach(function *() {
    //clean all action codes first
    db.action_codes.destroySync({});

    var actionCode1 =
      new ActionCode({
        code: "5225",
        description: "Reinforcing Steel Installation"
      });
    actionCode1.save();
    var actionCode2 =
      new ActionCode({
        code: "5403",
        description: "Carpentry–low wage"
      });
    actionCode2.save();
    var actionCode3 =
      new ActionCode({
        code: "5432",
        description: "Carpentry–high wage"
      });
    actionCode3.save();
  });

// this should not be exposed
  // it('should be able to get all actioncodes available', function*() {
  //   const response =
  //   yield request.get('/actioncodes')
  //   .set('Content-Type', 'application/json')
  //   .end();
  //   expect(response.status).to.equal(200, response.text);
  //   expect(response.body).to.be.an('object');
  //   expect(response.body.result.length).to.equal(3);
  // });

  it('should be able to load actioncode by id', function*() {
    const response =
    yield request.get('/actioncodes/lookup/cAr')
    .set('Content-Type', 'application/json')
    .end();

    var actionCode = response.body.actionCodes[0];

    const response1 =
    yield request.get('/actioncodes/' + actionCode.id)
    .set('Content-Type', 'application/json')
    .end();

    expect(response1.status).to.equal(200, response1.text);
    expect(response1.body).to.be.an('object');
    expect(response1.body.result).to.deep.equal(actionCode);
  });


  it('should be able to lookup actioncode by string', function*() {
    const response =
    yield request.get('/actioncodes/lookup/cAr')
    .set('Content-Type', 'application/json')
    .end();

    expect(response.status).to.equal(200, response.text);
    expect(response.body).to.be.an('object');
    expect(response.body.actionCodes.length).to.equal(2);

  });


  it('should load action codes for employee', function*() {
    var user, token;

    var userEmail = uuid.v4() + "@example.com";
    var password = 'secret';
    user = new User({email: userEmail, password: password});
    user.save();

    //authenticate and obtain a token
    const resp =
    yield request.post('/auth')
    .set('Content-Type', 'application/json')
    .send({email: userEmail, password: password })
    .end();
    token = resp.body.token;


    const response =
    yield request.get('/actioncodes/lookup/cAr')
    .set('Content-Type', 'application/json')
    .end();

    var actionCode = response.body.actionCodes[0];

    var action_code_id = actionCode.id;
    var employee_id = 100;

    const response1 =
    yield request.post('/employees/' + employee_id + '/actioncodes/' +action_code_id)
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .end();

    const response2 =
    yield request.get('/employees/' + employee_id + '/actioncodes')
    .set('Content-Type', 'application/json')
    .end();
    expect(response2.status).to.equal(200, response2.text);
    expect(response2.body).to.be.an('object');
    expect(response2.body.actionCodes.length).to.equal(1);

    const response3 =
    yield request.delete('/employees/' + employee_id + '/actioncodes/' + action_code_id)
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .end();
    expect(response3.status).to.equal(200, response3.text);
    expect(response3.body.result).to.equal("employeesActionCode successfully deleted");


    const response4 =
    yield request.get('/employees/' + employee_id + '/actioncodes')
    .set('Content-Type', 'application/json')
    .end();
    expect(response4.status).to.equal(200, response4.text);
    expect(response4.body).to.be.an('object');
    expect(response4.body.actionCodes.length).to.equal(0);

  });

});
