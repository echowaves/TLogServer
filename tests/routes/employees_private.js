'use strict';

const supertest = require('co-supertest'); // SuperAgent-driven library for testing HTTP servers
const expect    = require('chai').expect;  // BDD/TDD assertion library
require('co-mocha');                     // enable support for generators in mocha tests using co
var uuid = require('uuid');

let parse = require('co-body');

process.env.NODE_ENV = 'test'
const app = require('../../app.js');

const request = supertest.agent(app.listen());

var assert = require('assert');
var User   = require('../../models/user'),
    Employee = require('../../models/employee');

describe('/employees private routes testing', function() {
  var user, token;

  beforeEach(function *() {
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
  });

  it('should not be able to view an employee unless authenticated', function*() {
    const response =
      yield request.get('/employees')
    .set('Content-Type', 'application/json')
    .end();
    expect(response.status).to.equal(401, response.text);
  });

  it('should be able to add an employee', function*() {
    var email = uuid.v4() + "@example.com";
    const response =
      yield request.post('/employees')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .send({email: email, name: "Joe Doh"})
    .end();
    expect(response.status).to.equal(200, response.text);
    expect(response.body).to.contain.keys('result');
    expect(response.body).to.contain.keys('id');
    expect(response.body.result).to.equal('employee successfully added');

  });

  it('should be able to activate an employee', function*() {
    var email = uuid.v4() + "@example.com";

    const response =
      yield request.post('/employees')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .send({email: email, name: "Joe Doh"})
    .end();
    console.log(response.body);


// // console.log('/employees/' + employee.id + '/activation');
// // console.log(token);
//
//     const response =
//       yield request.put("/employees/" + employee.id + "/activation")
//     .set('Content-Type', 'application/json')
//     .set('Authorization', 'Bearer ' + token)
//     .end();
//     // expect(response.status).to.equal(200, response.text);
//     // expect(response.body).to.be.an('object');
//     // expect(response.body).to.be.json;
//     // expect(response.body).to.contain.keys('activation_code');
//
  });

  it('should not be able to activate an employee which does not belong to current user', function*() {

  });



});
