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
var User   = require('../../models/user');


describe('/employees private routes testing', function() {
  var user;

  beforeEach(function () {
    var userEmail = uuid.v4() + "@example.com";
    user = new User({email: userEmail, password: 'secret'});
    user.save();
  });



  it('should not be able to view an employee unless authenticated', function*() {
    const response =
      yield request.get('/employees')
    .set('Content-Type', 'application/json')
    .end();
    expect(response.status).to.equal(401, response.text);
  });



});
