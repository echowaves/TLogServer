'use strict';

const supertest = require('co-supertest'); // SuperAgent-driven library for testing HTTP servers
const expect    = require('chai').expect;  // BDD/TDD assertion library
require('co-mocha');                     // enable support for generators in mocha tests using co
var uuid = require('uuid');

process.env.NODE_ENV = 'test'
const app = require('../../app.js');

const request = supertest.agent(app.listen());

var assert = require('assert'),
    User   = require('../../models/user');


describe('/user public routes testing', function() {


  it('should be able to register a user and authenticate', function*() {
    var email = uuid.v4() + "@example.com",
        password = 'password';
    const response =
    yield request.post('/users')
    .set('Content-Type', 'application/json')
    .send({email: email, password: password })
    .end();
    expect(response.status).to.equal(200, response.text);
    expect(response.body).to.be.an('object');
    expect(response.body).to.contain.keys('result');
    expect(response.body).to.contain.keys('id');
    expect(response.body.result).to.equal('sign up successfull');


    const response2 =
    yield request.post('/auth')
    .set('Content-Type', 'application/json')
    .send({email: email, password: password })
    .end();

    expect(response2.status).to.equal(200, response2.text);
    expect(response2.body).to.be.an('object');

    expect(response2.body).to.contain.keys('token');
    expect(response2.body).to.be.json;

  });

});
