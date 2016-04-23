'use strict';

const supertest = require('co-supertest'); // SuperAgent-driven library for testing HTTP servers
const expect    = require('chai').expect;  // BDD/TDD assertion library
require('co-mocha');                     // enable support for generators in mocha tests using co

const app = require('../../app.js');
const request = supertest.agent(app.listen());


var API_VERSION_ANDROID = require('../../consts').API_VERSION_ANDROID;
var API_VERSION_IOS     = require('../../consts').API_VERSION_IOS;


describe('/check API version', function() {

  it('should return correct API version for IOS', function*() {
    var response =
    yield request.get('/api_version/ios')
    .set('Content-Type', 'application/json')
    .end();
    expect(response.status).to.equal(200, response.text);
    expect(response.body).to.contain.keys('version');
    expect(response.body.version).to.equal(API_VERSION_IOS);
  });

  it('should return correct API version for Android', function*() {
    var response =
    yield request.get('/api_version/android')
    .set('Content-Type', 'application/json')
    .end();
    expect(response.status).to.equal(200, response.text);
    expect(response.body).to.contain.keys('version');
    expect(response.body.version).to.equal(API_VERSION_ANDROID);
  });

});
