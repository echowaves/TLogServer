'use strict';

const supertest = require('co-supertest'); // SuperAgent-driven library for testing HTTP servers
const expect    = require('chai').expect;  // BDD/TDD assertion library
require('co-mocha');                     // enable support for generators in mocha tests using co
var uuid = require('uuid');

var db = require('../../consts').DB;
var moment = require('moment');

process.env.NODE_ENV = 'test'
const app = require('../../app.js');

const request = supertest.agent(app.listen());

var assert = require('assert');
var User   = require('../../models/user');
    // Employee = require('../../models/employee');


describe('/subcontractors private routes testing', function() {
  var user, token;

  beforeEach(function *() {
    //cleanup users
    db.users.destroySync({});
    //cleanup employees
    db.employees.destroySync({});
    //cleanup subcontractors
    db.subcontractors.destroySync({});


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

  it('should not be able to view subcontractors for a user unless authenticated', function*() {
    const response =
      yield request.get('/subcontractors')
    .set('Content-Type', 'application/json')
    .end();
    expect(response.status).to.equal(401, response.text);
  });


  it('should be able to add an subcontractor', function*() {
    const coi_expires_at = moment().add(1, 'd').format();
    const response =
      yield request.post('/subcontractors')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .send({name: "Joe Doh"})
    .end();
    expect(response.status).to.equal(200, response.text);
    expect(response.body).to.contain.keys('result');
    expect(response.body).to.contain.keys('subcontractor');
    expect(response.body.result).to.equal('subcontractor successfully added');
  });


  it('should not be able to add a subcontractor without a name', function*() {
    const coi_expires_at = moment().add(1, 'd').format();
    const response =
      yield request.post('/subcontractors')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .send({coi_expires_at: coi_expires_at})
    .end();
    expect(response.status).to.equal(400, response.text);
    expect(response.body).to.contain.keys('error');
    expect(response.body.error).to.equal('missing parameter');
  });


  it('should be able to load all sibcontractors belonging to current user', function*() {
    // add a subcontractor to a user
    const coi_expires_at = moment().add(1, 'd').format();
    const response =
      yield request.post('/subcontractors')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .send({name: "John Smith", coi_expires_at: coi_expires_at})
    .end();

    // add another employee to user
    const another_coi_expires_at = moment().add(1, 'd').format();
    const anotherResponse =
      yield request.post('/subcontractors')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .send({name: "John2 Smith2", coi_expires_at: another_coi_expires_at})
    .end();

    // try to load all employess
    const response3 =
      yield request.get("/subcontractors")
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .end();
    expect(response3.status).to.equal(200, response.text);
    expect(response3.body).to.be.an('object');
    expect(response3.body).to.be.json;
    expect(response3.body).to.contain.key("subcontractors");
    expect(response3.body.subcontractors[0].user_id).to.equal(user.id);
    expect(response3.body.subcontractors[1].user_id).to.equal(user.id);
  });


  it.only('should be able to load a subcontractor by id', function*() {
    // add a subcontractor to a user
    const coi_expires_at = moment().add(1, 'd').format();
    const response =
      yield request.post('/subcontractors')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .send({name: "John Smith", coi_expires_at: coi_expires_at})
    .end();

    var subcontractor_id = response.body.subcontractor.id;    
    // try to load subcontractor
    const response3 =
      yield request.get("/subcontractors/" + subcontractor_id)
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .end();
    expect(response3.status).to.equal(200, response3.text);
    expect(response3.body).to.be.an('object');
    expect(response3.body).to.be.json;
    expect(response3.body).to.contain.key("result");
    expect(response3.body.subcontractor.user_id).to.equal(user.id);
    expect(response3.body.subcontractor.id).to.equal(subcontractor_id);
  });


  it('should not be able to load a subcontractor by id which belongs to a wrong user', function*() {
    // add a subcontractor to a user
    const coi_expires_at = moment().add(1, 'd').format();
    const response =
      yield request.post('/subcontractors')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .send({name: "John Smith", coi_expires_at: coi_expires_at})
    .end();

    var subcontractor_id = response.body.subcontractor.id;


    // register and authenticate another user
    var anotherUserEmail = uuid.v4() + "@example.com";
    var anotherUserPassword = 'secret';
    const anotherUserResponse =
    yield request.post('/users')
    .set('Content-Type', 'application/json')
    .send({email: anotherUserEmail, password: anotherUserPassword })
    .end();

    var anotherUserId = anotherUserResponse.body.id;

    //authenticate and obtain a another token
    const resp =
    yield request.post('/auth')
    .set('Content-Type', 'application/json')
    .send({email: anotherUserEmail, password: anotherUserPassword })
    .end();
    var anotherToken = resp.body.token;

    // try to load subcontractor
    const response3 =
      yield request.get("/subcontractors/" + subcontractor_id)
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + anotherToken)
    .end();
    expect(response3.status).to.equal(403, response3.text);
    expect(response3.body).to.be.an('object');
    expect(response3.body).to.be.json;
    expect(response3.body).to.contain.key("error");
    expect(response3.body.error).to.equal("the subcontractor does not belong to currenty authenticated user");
  });


  it('should be able to update an subcontractor', function*() {
    var coi_expires_at = moment().add(1, 'd').format();
    const response =
      yield request.post('/subcontractors')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .send({name: "Joe Doh", coi_expires_at: coi_expires_at})
    .end();

    var subcontractorId = response.body.subcontractor.id;

    coi_expires_at = moment().add(2, 'd').format();
    var response1 =
      yield request.put('/subcontractors/' + subcontractorId)
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .send({name: "Joe Doh2", coi_expires_at: coi_expires_at})
    .end();
    expect(response1.status).to.equal(200, response1.text);
    expect(response1.body).to.be.an('object');
    expect(response1.body).to.be.json;
    expect(response1.body).to.contain.key("result");
    expect(response1.body.result).to.equal("subcontractor successfully updated");
  });


  it('should not be able to update a subcontractor which does not belong to current user', function*() {
    // add a subcontractor to a first user
    const coi_expires_at = moment().add(2, 'd').format();
    const response =
      yield request.post('/subcontractors')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .send({name: "John Smith", coi_expires_at: coi_expires_at})
    .end();

    // register and authenticate another user
    var anotherUserEmail = uuid.v4() + "@example.com";
    var anotherUserPassword = 'secret';
    const anotherUserResponse =
    yield request.post('/users')
    .set('Content-Type', 'application/json')
    .send({email: anotherUserEmail, password: anotherUserPassword })
    .end();

    var anotherUserId = anotherUserResponse.body.id;

    //authenticate and obtain a another token
    const resp =
    yield request.post('/auth')
    .set('Content-Type', 'application/json')
    .send({email: anotherUserEmail, password: anotherUserPassword })
    .end();
    var anotherToken = resp.body.token;

    // add a subcontractor to another user
    var another_coi_expires_at = moment().add(3, 'd').format();
    const anotherResponse =
      yield request.post('/subcontractors')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + anotherToken)
    .send({name: "John Smith", coi_expires_at: another_coi_expires_at})
    .end();

    another_coi_expires_at = moment().add(4, 'd').format();
    // try to update a subcontractor for a wrong user
    const response3 =
      yield request.put("/subcontractors/" + anotherResponse.body.subcontractor.id )
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .send({name: "Joe Doh2", coi_expires_at:another_coi_expires_at})
    .end();
    expect(response3.status).to.equal(403, response.text);
    expect(response3.body).to.be.an('object');
    expect(response3.body).to.be.json;
    expect(response3.body).to.contain.keys('error');
    expect(response3.body.error).to.equal('the subcontractor does not belong to currenty authenticated user');
  });


  //////////////////////////////////////////////////////////////////////////

  it('should be able to delete a subcontractor', function*() {
    const coi_expires_at = moment().add(2, 'd').format();
    // add a subcontractor
    const response =
    yield request.post('/subcontractors')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .send({name: "John Smith", coi_expires_at: coi_expires_at})
    .end();

    const response2 =
    yield request.delete("/subcontractors/" + response.body.subcontractor.id)
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .end();
    expect(response2.status).to.equal(200, response.text);
    expect(response2.body).to.be.an('object');
    expect(response2.body).to.be.json;
    expect(response2.body).to.contain.keys('result');
    expect(response2.body.result).to.equal("subcontractor deleted");

  });

  it('should not be able to delete a subcontractor which has employees', function*() {
    const coi_expires_at = moment().add(2, 'd').format();
    // add a subcontractor
    const response =
    yield request.post('/subcontractors')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .send({name: "John Smith", coi_expires_at: coi_expires_at})
    .end();

    var email = uuid.v4() + "@example.com";
    const response1 =
      yield request.post('/employees')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .send({email: email, name: "Joe Doh", subcontractor_id: response.body.subcontractor.id})
    .end();

    const response2 =
    yield request.delete("/subcontractors/" + response.body.subcontractor.id)
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .end();
    expect(response2.status).to.equal(422, response2.text);
    expect(response2.body).to.be.an('object');
    expect(response2.body).to.be.json;
    expect(response2.body).to.contain.keys('error');
    expect(response2.body.error).to.equal("subcontractor can not be deleted, because it has active employees");

  });


  it('should not be able to delete a subcontractor which does not belong to current user', function*() {
    // add a subcontractor to a first user
    var coi_expires_at = moment().add(2, 'd').format();
    const response =
    yield request.post('/subcontractors')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .send({name: "John Smith", coi_expires_at: coi_expires_at})
    .end();

    // register and authenticate another user
    var anotherUserEmail = uuid.v4() + "@example.com";
    var anotherUserPassword = 'secret';
    const anotherUserResponse =
    yield request.post('/users')
    .set('Content-Type', 'application/json')
    .send({email: anotherUserEmail, password: anotherUserPassword })
    .end();

    var anotherUserId = anotherUserResponse.body.id;

    //authenticate and obtain a another token
    const resp =
    yield request.post('/auth')
    .set('Content-Type', 'application/json')
    .send({email: anotherUserEmail, password: anotherUserPassword })
    .end();
    var anotherToken = resp.body.token;

    // add a subcontractor to another user
    coi_expires_at = moment().add(3, 'd').format();
    const anotherResponse =
    yield request.post('/subcontractors')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + anotherToken)
    .send({name: "John Smith", coi_expires_at: coi_expires_at})
    .end();

    // try to delete a subcontractor for a wrong user
    const response3 =
    yield request.delete("/subcontractors/" + anotherResponse.body.subcontractor.id )
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .end();
    expect(response3.status).to.equal(403, response.text);
    expect(response3.body).to.be.an('object');
    expect(response3.body).to.be.json;
    expect(response3.body).to.contain.keys('error');
    expect(response3.body.error).to.equal('the subcontractor does not belong to currenty authenticated user');

  });


  // it.only('should be able to upload COI for subcontractor', function*(done) {
  //
  //   const coi_expires_at = moment().add(1, 'd').format();
  //
  //   const response =
  //     yield request.post('/subcontractors')
  //   .set('Content-Type', 'application/json')
  //   .set('Authorization', 'Bearer ' + token)
  //   .send({name: "Joe Doh"})
  //   .end();
  //
  //   //now try to upload the coi file
  //   const response1 =
  //   yield request.post('/subcontractors/' + response.body.subcontractor.id + "/coi")
  //   .set('Authorization', 'Bearer ' + token)
  //   .field('Content-Type', 'multipart/form-data')
  //   .field('coi_expires_at', coi_expires_at)
  //   .attach('coi', './assets/logo-big.png')
  //   .end();
  //
  //   expect(response1.status).to.equal(200, response1.text);
  //   expect(response1.body).to.be.an('object');
  //   expect(response1.body).to.be.json;
  //   expect(response1.body).to.contain.keys('result');
  //   expect(response1.body.result).to.equal('subcontractor CIO successfully uploaded');
  //
  //   yield delay(1, done);
  //
  // });



});
