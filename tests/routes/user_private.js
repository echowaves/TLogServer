'use strict';

const supertest = require('co-supertest'); // SuperAgent-driven library for testing HTTP servers
const expect    = require('chai').expect;  // BDD/TDD assertion library
require('co-mocha');                     // enable support for generators in mocha tests using co
var uuid = require('uuid');

let parse = require('co-body');

process.env.NODE_ENV = 'test'
const app = require('../../app.js');

const request = supertest.agent(app.listen());

var assert = require('assert'),
    User   = require('../../models/user');


describe('/user private routes testing', function() {

  it('should not be able to view a user unless authenticated', function*() {
    const response =
    yield request.get('/user')
    .set('Content-Type', 'application/json')
    .end();
    expect(response.status).to.equal(401, response.text);
    expect(response.body).to.be.an('object');
  });

  it('should be able to view an authenticated user', function*() {
    var email = uuid.v4() + "@example.com",
        password = 'password';
    const response =
    yield request.put('/user')
    .set('Content-Type', 'application/json')
    .send({email: email, password: password })
    .end();
    expect(response.status).to.equal(200, response.text);
    expect(response.body).to.be.an('object');


    const response2 =
    yield request.post('/auth')
    .set('Content-Type', 'application/json')
    .send({email: email, password: password })
    .end();
    expect(response2.status).to.equal(200, response2.text);
    expect(response2.body).to.be.an('object');
    expect(response2.body).to.contain.keys('token');
    expect(response2.body).to.be.json;

    var token = response2.body.token;

    const response3 =
    yield request.get('/user')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .end();
    expect(response3.status).to.equal(200, response3.text);
    expect(response3.body).to.be.an('object');
    expect(response3.body).to.be.json;
    expect(response3.body).to.contain.keys(['id', 'email', 'iat', 'exp']);
    expect(response3.body.email).to.equal(email);
  });


});
