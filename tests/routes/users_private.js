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

describe('/users private routes testing', function() {

  it('should not be able to view a user unless authenticated', function*() {
    const response =
      yield request.get('/users')
    .set('Content-Type', 'application/json')
    .end();
    expect(response.status).to.equal(401, response.text);
  });

  it('should be able to view an authenticated user', function*() {
    var email = uuid.v4() + "@example.com",
        password = 'password';
    const response =
    yield request.post('/users')
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
    yield request.get('/users')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .end();
    expect(response3.status).to.equal(200, response3.text);
    expect(response3.body).to.be.an('object');
    expect(response3.body).to.be.json;
    expect(response3.body).to.have.property('id');
    expect(response3.body).to.have.property('email');
    expect(response3.body).to.not.have.property('password');
    expect(response3.body.email).to.equal(email);
  });


  it('should be able to update a user', function*() {
    var email = uuid.v4() + "@example.com",
        password = 'password';
    const response =
    yield request.post('/users')
    .set('Content-Type', 'application/json')
    .send({email: email, password: password })
    .end();
    expect(response.status).to.equal(200, response.text);
    expect(response.body).to.be.an('object');

    //authenticate and obtain a token
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

    var email3 = uuid.v4() + "@example.com";
    const response3 =
    yield request.put('/users')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .send({email: email3})
    .end();
    expect(response3.status).to.equal(200, response3.text);
    expect(response3.body).to.be.an('object');
    expect(response3.body).to.contain.keys('result');
    expect(response3.body).to.be.json;


    const response4 =
    yield request.get('/users')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .end();
    expect(response4.status).to.equal(200, response4.text);
    expect(response4.body).to.be.an('object');
    expect(response4.body).to.be.json;
    expect(response4.body).to.have.property('id');
    expect(response4.body).to.have.property('email');
    expect(response4.body).to.not.have.property('password'); //the password should never be returned, even encrypted
    expect(response4.body.email).to.equal(email3);
  });


});
