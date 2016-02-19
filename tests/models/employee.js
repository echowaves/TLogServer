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

  beforeEach(function () {
    var userEmail = uuid.v4() + "@example.com";
    user = new User({email: userEmail, password: 'secret'});
    user.save();
  });

  it('should create a an employee', function *() {
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
    employee.save();
    assert(employee.id);
  });


});
