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
var User   = require('../../models/user'),
    Employee = require('../../models/employee');

describe('/checkins routes testing', function() {
  var user, token;

//   beforeEach(function *() {
//     var userEmail = uuid.v4() + "@example.com";
//     var password = 'secret';
//     user = new User({email: userEmail, password: password});
//     user.save();
//
//     //authenticate and obtain a token
//     const resp =
//     yield request.post('/auth')
//     .set('Content-Type', 'application/json')
//     .send({email: userEmail, password: password })
//     .end();
//     token = resp.body.token;
//   });
//
  it('should be able to create checkin');
  it('should be able to get a particuar checkin');
  it('should not be able to get a particular checkin if it does not belong to the employee');
  it('should be able to update checkin');
  it('should not be able to update checkin belonging to other employee');
  it('should be able to checkout');
  it('should not be able to checkout as a wrong employee');
  it('should be able to delete checkin');
  it('should not be able to delete checkin of the wrong employee');
  it('should be able to get all (first page by default) checkins for an employee');
  it('should be able to get paged results checkins for an employee');

//   it('should not be able to view an employee unless authenticated', function*() {
//     const response =
//       yield request.get('/employees')
//     .set('Content-Type', 'application/json')
//     .end();
//     expect(response.status).to.equal(401, response.text);
//   });
//
//   it('should be able to add an employee', function*() {
//     var email = uuid.v4() + "@example.com";
//     const response =
//       yield request.post('/employees')
//     .set('Content-Type', 'application/json')
//     .set('Authorization', 'Bearer ' + token)
//     .send({email: email, name: "Joe Doh"})
//     .end();
//     expect(response.status).to.equal(200, response.text);
//     expect(response.body).to.contain.keys('result');
//     expect(response.body).to.contain.keys('id');
//     expect(response.body.result).to.equal('employee successfully added');
//
//   });
//
//   it('should be able to activate an employee', function*() {
//     var email = uuid.v4() + "@example.com";
// // add an employee
//     const response =
//       yield request.post('/employees')
//     .set('Content-Type', 'application/json')
//     .set('Authorization', 'Bearer ' + token)
//     .send({email: email, name: "John Smith"})
//     .end();
//
//
//     const response1 =
//       yield request.post("/employees/" + response.body.id + "/activation")
//     .set('Content-Type', 'application/json')
//     .set('Authorization', 'Bearer ' + token)
//     .end();
//     expect(response1.status).to.equal(200, response.text);
//     expect(response1.body).to.be.an('object');
//     expect(response1.body).to.be.json;
//     expect(response1.body).to.contain.keys('activation_code');
//
//   });
//
//   it('should not be able to activate an employee which does not belong to current user', function*() {
//     // add an employee to a first user
//     var email = uuid.v4() + "@example.com";
//     const response =
//       yield request.post('/employees')
//     .set('Content-Type', 'application/json')
//     .set('Authorization', 'Bearer ' + token)
//     .send({email: email, name: "John Smith"})
//     .end();
//
//     // register and authenticate another user
//     var anotherUserEmail = uuid.v4() + "@example.com";
//     var anotherUserPassword = 'secret';
//     const anotherUserResponse =
//     yield request.post('/users')
//     .set('Content-Type', 'application/json')
//     .send({email: anotherUserEmail, password: anotherUserPassword })
//     .end();
//
//     var anotherUserId = anotherUserResponse.body.id;
//
//
//     //authenticate and obtain a another token
//     const resp =
//     yield request.post('/auth')
//     .set('Content-Type', 'application/json')
//     .send({email: anotherUserEmail, password: anotherUserPassword })
//     .end();
//     var anotherToken = resp.body.token;
//
//     // add an employee to another user
//     var anotherEmail = uuid.v4() + "@example.com";
//     const anotherResponse =
//       yield request.post('/employees')
//     .set('Content-Type', 'application/json')
//     .set('Authorization', 'Bearer ' + anotherToken)
//     .send({email: anotherEmail, name: "John Smith"})
//     .end();
//
//     // try to activate an employee for a wron user
//     const response3 =
//       yield request.post("/employees/" + anotherResponse.body.id + "/activation")
//     .set('Content-Type', 'application/json')
//     .set('Authorization', 'Bearer ' + token)
//     .end();
//     expect(response3.status).to.equal(403, response.text);
//     expect(response3.body).to.be.an('object');
//     expect(response3.body).to.be.json;
//     expect(response3.body).to.contain.keys('error');
//     expect(response3.body.error).to.equal('the employee does not belong to currenty authenticated user');
//
//   });
//
//   it('should be able to de-activate an employee', function*() {
//     var email = uuid.v4() + "@example.com";
// // add an employee
//     const response =
//       yield request.post('/employees')
//     .set('Content-Type', 'application/json')
//     .set('Authorization', 'Bearer ' + token)
//     .send({email: email, name: "John Smith"})
//     .end();
//
//
//     const response1 =
//       yield request.post("/employees/" + response.body.id + "/activation")
//     .set('Content-Type', 'application/json')
//     .set('Authorization', 'Bearer ' + token)
//     .end();
//     expect(response1.status).to.equal(200, response.text);
//     expect(response1.body).to.be.an('object');
//     expect(response1.body).to.be.json;
//     expect(response1.body).to.contain.keys('activation_code');
//
//     const response2 =
//       yield request.delete("/employees/" + response.body.id + "/activation")
//     .set('Content-Type', 'application/json')
//     .set('Authorization', 'Bearer ' + token)
//     .end();
//     expect(response2.status).to.equal(200, response.text);
//     expect(response2.body).to.be.an('object');
//     expect(response2.body).to.be.json;
//     expect(response2.body).to.contain.keys('result');
//     expect(response2.body.result).to.equal("employee deactivated");
//
//   });
//
//
//   it('should not be able to de-activate an employee which does not belong to current user', function*() {
//     // add an employee to a first user
//     var email = uuid.v4() + "@example.com";
//     const response =
//       yield request.post('/employees')
//     .set('Content-Type', 'application/json')
//     .set('Authorization', 'Bearer ' + token)
//     .send({email: email, name: "John Smith"})
//     .end();
//
//     // register and authenticate another user
//     var anotherUserEmail = uuid.v4() + "@example.com";
//     var anotherUserPassword = 'secret';
//     const anotherUserResponse =
//     yield request.post('/users')
//     .set('Content-Type', 'application/json')
//     .send({email: anotherUserEmail, password: anotherUserPassword })
//     .end();
//
//     var anotherUserId = anotherUserResponse.body.id;
//
//
//     //authenticate and obtain a another token
//     const resp =
//     yield request.post('/auth')
//     .set('Content-Type', 'application/json')
//     .send({email: anotherUserEmail, password: anotherUserPassword })
//     .end();
//     var anotherToken = resp.body.token;
//
//     // add an employee to another user
//     var anotherEmail = uuid.v4() + "@example.com";
//     const anotherResponse =
//       yield request.post('/employees')
//     .set('Content-Type', 'application/json')
//     .set('Authorization', 'Bearer ' + anotherToken)
//     .send({email: anotherEmail, name: "John Smith"})
//     .end();
//
//     // try to activate an employee for a wron user
//     const response3 =
//       yield request.delete("/employees/" + anotherResponse.body.id + "/activation")
//     .set('Content-Type', 'application/json')
//     .set('Authorization', 'Bearer ' + token)
//     .end();
//     expect(response3.status).to.equal(403, response.text);
//     expect(response3.body).to.be.an('object');
//     expect(response3.body).to.be.json;
//     expect(response3.body).to.contain.keys('error');
//     expect(response3.body.error).to.equal('the employee does not belong to currenty authenticated user');
//
//   });
//
//
//   it('should be able to load all employee belonging to current user', function*() {
//     // add an employee to a user
//     var email = uuid.v4() + "@example.com";
//     const response =
//       yield request.post('/employees')
//     .set('Content-Type', 'application/json')
//     .set('Authorization', 'Bearer ' + token)
//     .send({email: email, name: "John Smith"})
//     .end();
//
//     // add another employee to user
//     var anotherEmail = uuid.v4() + "@example.com";
//     const anotherResponse =
//       yield request.post('/employees')
//     .set('Content-Type', 'application/json')
//     .set('Authorization', 'Bearer ' + token)
//     .send({email: anotherEmail, name: "John Smith"})
//     .end();
//
//     // try to load all employess
//     const response3 =
//       yield request.get("/employees")
//     .set('Content-Type', 'application/json')
//     .set('Authorization', 'Bearer ' + token)
//     .end();
//     expect(response3.status).to.equal(200, response.text);
//     expect(response3.body).to.be.an('object');
//     expect(response3.body).to.be.json;
//     expect(response3.body).to.contain.key("results");
//     expect(response3.body.results[0].user_id).to.equal(user.id);
//     expect(response3.body.results[1].user_id).to.equal(user.id);
//   });
//
//   it('should be able to load an employee by id', function*() {
//     // add an employee to a user
//     var email = uuid.v4() + "@example.com";
//     const response =
//       yield request.post('/employees')
//     .set('Content-Type', 'application/json')
//     .set('Authorization', 'Bearer ' + token)
//     .send({email: email, name: "John Smith"})
//     .end();
//
//     var employee_id = response.body.id;
//     // try to load employee
//     const response3 =
//       yield request.get("/employees/" + employee_id)
//     .set('Content-Type', 'application/json')
//     .set('Authorization', 'Bearer ' + token)
//     .end();
//     expect(response3.status).to.equal(200, response3.text);
//     expect(response3.body).to.be.an('object');
//     expect(response3.body).to.be.json;
//     expect(response3.body).to.contain.key("result");
//     expect(response3.body.result.user_id).to.equal(user.id);
//     expect(response3.body.result.id).to.equal(employee_id);
//
//   });
//
//   it('should not be able to load an employee by id which belongs to a wrong user', function*() {
//     // add an employee to a user
//     var email = uuid.v4() + "@example.com";
//     const response =
//       yield request.post('/employees')
//     .set('Content-Type', 'application/json')
//     .set('Authorization', 'Bearer ' + token)
//     .send({email: email, name: "John Smith"})
//     .end();
//
//     var employee_id = response.body.id;
//
//
//     // register and authenticate another user
//     var anotherUserEmail = uuid.v4() + "@example.com";
//     var anotherUserPassword = 'secret';
//     const anotherUserResponse =
//     yield request.post('/users')
//     .set('Content-Type', 'application/json')
//     .send({email: anotherUserEmail, password: anotherUserPassword })
//     .end();
//
//     var anotherUserId = anotherUserResponse.body.id;
//
//     //authenticate and obtain a another token
//     const resp =
//     yield request.post('/auth')
//     .set('Content-Type', 'application/json')
//     .send({email: anotherUserEmail, password: anotherUserPassword })
//     .end();
//     var anotherToken = resp.body.token;
//
//
//     // try to load employee
//     const response3 =
//       yield request.get("/employees/" + employee_id)
//     .set('Content-Type', 'application/json')
//     .set('Authorization', 'Bearer ' + anotherToken)
//     .end();
//     expect(response3.status).to.equal(403, response3.text);
//     expect(response3.body).to.be.an('object');
//     expect(response3.body).to.be.json;
//     expect(response3.body).to.contain.key("error");
//     expect(response3.body.error).to.equal("the employee does not belong to currenty authenticated user");
//   });
//
//   it('should be able to update an employee', function*() {
//     var email = uuid.v4() + "@example.com";
//     const response =
//       yield request.post('/employees')
//     .set('Content-Type', 'application/json')
//     .set('Authorization', 'Bearer ' + token)
//     .send({email: email, name: "Joe Doh"})
//     .end();
//
//     var employeeId = response.body.id;
//
//     email = uuid.v4() + "@example.com";
//     var response1 =
//       yield request.put('/employees/' + employeeId)
//     .set('Content-Type', 'application/json')
//     .set('Authorization', 'Bearer ' + token)
//     .send({email: email, name: "Joe Doh2"})
//     .end();
//     expect(response1.status).to.equal(200, response1.text);
//     expect(response1.body).to.be.an('object');
//     expect(response1.body).to.be.json;
//     expect(response1.body).to.contain.key("result");
//     expect(response1.body.result).to.equal("employee successfully updated");
//   });
//
//
//   it('should not be able to update an employee which does not belong to current user', function*() {
//     // add an employee to a first user
//     var email = uuid.v4() + "@example.com";
//     const response =
//       yield request.post('/employees')
//     .set('Content-Type', 'application/json')
//     .set('Authorization', 'Bearer ' + token)
//     .send({email: email, name: "John Smith"})
//     .end();
//
//     // register and authenticate another user
//     var anotherUserEmail = uuid.v4() + "@example.com";
//     var anotherUserPassword = 'secret';
//     const anotherUserResponse =
//     yield request.post('/users')
//     .set('Content-Type', 'application/json')
//     .send({email: anotherUserEmail, password: anotherUserPassword })
//     .end();
//
//     var anotherUserId = anotherUserResponse.body.id;
//
//
//     //authenticate and obtain a another token
//     const resp =
//     yield request.post('/auth')
//     .set('Content-Type', 'application/json')
//     .send({email: anotherUserEmail, password: anotherUserPassword })
//     .end();
//     var anotherToken = resp.body.token;
//
//     // add an employee to another user
//     var anotherEmail = uuid.v4() + "@example.com";
//     const anotherResponse =
//       yield request.post('/employees')
//     .set('Content-Type', 'application/json')
//     .set('Authorization', 'Bearer ' + anotherToken)
//     .send({email: anotherEmail, name: "John Smith"})
//     .end();
//
//     email = uuid.v4() + "@example.com";
//     // try to update an employee for a wron user
//     const response3 =
//       yield request.put("/employees/" + anotherResponse.body.id )
//     .set('Content-Type', 'application/json')
//     .set('Authorization', 'Bearer ' + token)
//     .send({email: email, name: "Joe Doh2"})
//     .end();
//     expect(response3.status).to.equal(403, response.text);
//     expect(response3.body).to.be.an('object');
//     expect(response3.body).to.be.json;
//     expect(response3.body).to.contain.keys('error');
//     expect(response3.body.error).to.equal('the employee does not belong to currenty authenticated user');
//   });
//
//
// //////////////////////////////////////////////////////////////////////////
//
// it('should be able to delete an employee', function*() {
//   var email = uuid.v4() + "@example.com";
// // add an employee
//   const response =
//     yield request.post('/employees')
//   .set('Content-Type', 'application/json')
//   .set('Authorization', 'Bearer ' + token)
//   .send({email: email, name: "John Smith"})
//   .end();
//
//   const response2 =
//     yield request.delete("/employees/" + response.body.id)
//   .set('Content-Type', 'application/json')
//   .set('Authorization', 'Bearer ' + token)
//   .end();
//   expect(response2.status).to.equal(200, response.text);
//   expect(response2.body).to.be.an('object');
//   expect(response2.body).to.be.json;
//   expect(response2.body).to.contain.keys('result');
//   expect(response2.body.result).to.equal("employee deleted");
//
// });
//
//
// it('should not be able to delete an employee which does not belong to current user', function*() {
//   // add an employee to a first user
//   var email = uuid.v4() + "@example.com";
//   const response =
//     yield request.post('/employees')
//   .set('Content-Type', 'application/json')
//   .set('Authorization', 'Bearer ' + token)
//   .send({email: email, name: "John Smith"})
//   .end();
//
//   // register and authenticate another user
//   var anotherUserEmail = uuid.v4() + "@example.com";
//   var anotherUserPassword = 'secret';
//   const anotherUserResponse =
//   yield request.post('/users')
//   .set('Content-Type', 'application/json')
//   .send({email: anotherUserEmail, password: anotherUserPassword })
//   .end();
//
//   var anotherUserId = anotherUserResponse.body.id;
//
//
//   //authenticate and obtain a another token
//   const resp =
//   yield request.post('/auth')
//   .set('Content-Type', 'application/json')
//   .send({email: anotherUserEmail, password: anotherUserPassword })
//   .end();
//   var anotherToken = resp.body.token;
//
//   // add an employee to another user
//   var anotherEmail = uuid.v4() + "@example.com";
//   const anotherResponse =
//     yield request.post('/employees')
//   .set('Content-Type', 'application/json')
//   .set('Authorization', 'Bearer ' + anotherToken)
//   .send({email: anotherEmail, name: "John Smith"})
//   .end();
//
//   // try to delete an employee for a wrong user
//   const response3 =
//     yield request.delete("/employees/" + anotherResponse.body.id )
//   .set('Content-Type', 'application/json')
//   .set('Authorization', 'Bearer ' + token)
//   .end();
//   expect(response3.status).to.equal(403, response.text);
//   expect(response3.body).to.be.an('object');
//   expect(response3.body).to.be.json;
//   expect(response3.body).to.contain.keys('error');
//   expect(response3.body.error).to.equal('the employee does not belong to currenty authenticated user');
//
// });









});
