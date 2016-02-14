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


describe('/auth route testing', function() {

  it('should unable to authenticate user that does not exists', function*() {
    var userEmail = uuid.v4() + "@example.com";

    const response =
    yield request.post('/auth')
    .set('Content-Type', 'application/json')
    .send({email: userEmail, password: 'qweqwe' })
    .end();
    expect(response.status).to.equal(401, response.text);
    expect(response.body).to.be.an('object');
    expect(response.body.error).to.equal("Wrong user or password");

  });

});
