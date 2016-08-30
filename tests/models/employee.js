process.env.NODE_ENV = 'test'
const app = require('../../app.js');


var assert   = require('assert');

import * as User from '../../models/user';
import * as Employee from '../../models/employee';

require('co-mocha');
var uuid = require('uuid');



describe('Employee model testing', function() {
  var user;

  beforeEach(function *() {
    var userEmail = uuid.v4() + "@example.com";
    user =
    yield User.save({email: userEmail, password: 'secret'});
  });


  it('should assign id after being saved', function *() {
    var employeeEmail = uuid.v4() + "@example.com";
    var employee =
    yield Employee.save({
      user_id: user.id,
      name: "John Smith",
      email: employeeEmail});
      assert(employee.id);
    });


  it('should return all employess that belong to user', function *() {
    var employeeEmail = uuid.v4() + "@example.com";
    var employee =
    yield Employee.save({
      user_id: user.id,
      name: "John Smith",
      email: employeeEmail});

    var employeeEmail2 = uuid.v4() + "@example.com";
    var employee2 =
    yield Employee.save({
      user_id: user.id,
      name: "John Smith",
      email: employeeEmail2});

    var employees = yield Employee.loadAllForUser(user.id);
    assert(Array.isArray(employees), "must be array");
    assert(employees.length == 2, "array size must be 2");
  });

  it('should return all employess that belong to a subcontractor', function *() {
    var employeeEmail = uuid.v4() + "@example.com";
    var employee =
    yield Employee.save({
      user_id: user.id,
      name: "John Smith",
      email: employeeEmail,
      subcontractor_id: 111});

    var employeeEmail2 = uuid.v4() + "@example.com";
    var employee2 =
    yield Employee.save({
      user_id: user.id,
      name: "John Smith",
      email: employeeEmail2,
      subcontractor_id: 111});

    var employees = yield Employee.loadAllForSubcontractor(111);
    assert(Array.isArray(employees), "must be array");
    assert(employees.length == 2, "array size must be 2");
  });

});
