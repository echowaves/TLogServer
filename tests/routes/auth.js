'use strict';

const supertest = require('co-supertest'); // SuperAgent-driven library for testing HTTP servers
const expect    = require('chai').expect;  // BDD/TDD assertion library
require('co-mocha');                     // enable support for generators in mocha tests using co
let parse = require('co-body');

process.env.NODE_ENV = 'test'
const app = require('../../app.js');

const request = supertest.agent(app.listen());

const headers = { Host: 'api.localhost' }; // set host header

var assert = require('assert'),
    User   = require('../../models/user');


describe('/auth route testing', function() {

  beforeEach(function(done) {
    var user = new User();
    user.delete();// delete all users before each test run
    done();
  });


  it('should unable to authenticate user that does not exists', function*() {
    const response =
    yield request.post('/auth')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send({email: 'qwe@example.com', password: 'qweqwe' })
    .end();
    expect(response.status).to.equal(401, response.text);
    expect(response.body).to.be.an('object');

  });

  it('should be able to register a user and authenticate', function*() {
    var email = 'asdasd@example.com',
        password = 'password';
    const response =
    yield request.put('/user')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send({email: email, password: password })
    .end();
    expect(response.status).to.equal(200, response.text);
    expect(response.body).to.be.an('object');


    const response2 =
    yield request.post('/auth')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send({email: email, password: password })
    .end();

    expect(response2.status).to.equal(200, response2.text);
    expect(response2.body).to.be.an('object');
    // .expect('Content-Type', /json/)

    expect(response2.body).to.contain.keys('token');
    expect(response2.body).to.be.json;

    // expect(response.body).to.have.property('token');

  });
});
