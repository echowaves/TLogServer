'use strict';

const supertest = require('co-supertest'); // SuperAgent-driven library for testing HTTP servers
const expect    = require('chai').expect;  // BDD/TDD assertion library
require('co-mocha');                     // enable support for generators in mocha tests using co
let parse = require('co-body');

process.env.NODE_ENV = 'test'
const app = require('../../app.js');

const request = supertest.agent(app.listen());

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
    .set('Content-Type', 'application/json')
    .send({email: 'qwe@example.com', password: 'qweqwe' })
    .end();
    expect(response.status).to.equal(401, response.text);
    expect(response.body).to.be.an('object');

  });

});
