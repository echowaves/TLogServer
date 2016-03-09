'use strict';

const supertest = require('co-supertest'); // SuperAgent-driven library for testing HTTP servers
const expect    = require('chai').expect;  // BDD/TDD assertion library
require('co-mocha');                     // enable support for generators in mocha tests using co
var uuid = require('uuid');

let parse = require('co-body');

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

    var actionCode = response.body.result[0];

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
    expect(response.body.result.length).to.equal(2);

  });

});
