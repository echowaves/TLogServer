'use strict';

process.env.NODE_ENV = 'test'
const app = require('../../app.js');


var assert   = require('assert'),
    Employee = require('../../models/employee'),
    User     = require('../../models/user');

require('co-mocha');
var uuid = require('uuid');



describe('Employee model testing', function() {
  var user;

  beforeEach(function *() {
    var userEmail = uuid.v4() + "@example.com";
    user = new User({email: userEmail, password: 'secret'});
    yield user.save.bind(user);
  });

  it('should create an employee', function *() {
    var employee = new Employee();
    assert.equal(typeof employee, 'object');
  });

  it('should store properties passed when instantiated', function *() {
    var employeeEmail = uuid.v4() + "@example.com";
    var employee =
      new Employee({
        user_id: user.id,
        name: "John Smith",
        email: employeeEmail});
    assert.equal(employee.user_id, user.id);
    assert.equal(employee.name, "John Smith");
    assert.equal(employee.email, employeeEmail);
  });

  it('should assign id after being saved', function *() {
    var employeeEmail = uuid.v4() + "@example.com";
    var employee =
      new Employee({
        user_id: user.id,
        name: "John Smith",
        email: employeeEmail});
    yield employee.save.bind(employee);
    assert(employee.id);
  });


  it('should return all employess that belong to user', function *() {
    var employeeEmail = uuid.v4() + "@example.com";
    var employee =
      new Employee({
        user_id: user.id,
        name: "John Smith",
        email: employeeEmail});
    yield employee.save.bind(employee);

    var employeeEmail2 = uuid.v4() + "@example.com";
    var employee2 =
      new Employee({
        user_id: user.id,
        name: "John Smith",
        email: employeeEmail2});
    yield employee2.save.bind(employee2);

    var employees = yield employee.loadAllForUser.bind(employee, user.id);
    assert(Array.isArray(employees), "must be array");
    assert(employees.length == 2, "array size must be 2");
  });

  it('should return all employess that belong to a subcontractor', function *() {
    var employeeEmail = uuid.v4() + "@example.com";
    var employee =
      new Employee({
        user_id: user.id,
        name: "John Smith",
        email: employeeEmail,
        subcontractor_id: 111});
    yield employee.save.bind(employee);

    var employeeEmail2 = uuid.v4() + "@example.com";
    var employee2 =
      new Employee({
        user_id: user.id,
        name: "John Smith",
        email: employeeEmail2,
        subcontractor_id: 111});
    yield employee2.save.bind(employee2);

    var employeeTemplate  = new Employee({subcontractor_id:111});
    var employees = yield employeeTemplate.loadAllForSubcontractor.bind(employeeTemplate);
    assert(Array.isArray(employees), "must be array");
    assert(employees.length == 2, "array size must be 2");
  });


});
