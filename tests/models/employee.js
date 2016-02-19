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
  //
  // it('should hash a password after save', function *() {
  //   var userEmail = uuid.v4() + "@example.com";
  //   var user = new User({email: userEmail, password: 'secret',});
  //   user.save();
  //   assert.notEqual(user.password, 'secret');
  // });
  //
  // it('should not hash password for users with id', function *() {
  //   var userEmail = uuid.v4() + "@example.com";
  //   var user = new User({email: userEmail, password: 'secret'});
  //   user.hashPassword();
  //   assert(user.comparePassword('secret'));
  //   user.id = 123;
  //   user.hashPassword();
  //   user.hashPassword();
  //   assert(user.comparePassword('secret'));
  // });
  //
  // it('should validate correct password', function *() {
  //   var userEmail = uuid.v4() + "@example.com";
  //   var user = new User({password: 'secret', email: userEmail});
  //   user.save();
  //   assert(user.comparePassword('secret'));
  // });
  //
  // it('should not validate wrong password', function *() {
  //   var userEmail = uuid.v4() + "@example.com";
  //   var user = new User({password: 'secretwrong', email: userEmail});
  //   user.save();
  //   assert(!user.comparePassword('secret'));
  // });
  //
  // it('should validate user by email and password', function *() {
  //   var userEmail = uuid.v4() + "@example.com";
  //   var user = new User({password: 'secret', email: userEmail});
  //   user.save();
  //
  //   var validUser = new User({password: 'secret', email: userEmail});
  //   var invalidUserEmail = new User({password: 'secret', email: '1' + userEmail});
  //   var invalidUserPasword = new User({password: 'secret1', email: userEmail});
  //
  //   assert.notEqual(validUser.validateUserAndGenerateToken(), null);
  //   assert.equal(invalidUserEmail.validateUserAndGenerateToken(), null);
  //   assert.equal(invalidUserPasword.validateUserAndGenerateToken(), null);
  // });
  //
  // it('should generate jwt while validating user by email and password', function *() {
  //   var userEmail = uuid.v4() + "@example.com";
  //   var user = new User({password: 'secret', email: userEmail});
  //   user.save();
  //
  //   var validUser = new User({password: 'secret', email: userEmail});
  //
  //   var token = validUser.validateUserAndGenerateToken();
  //
  //   assert(token.length > 10);
  //
  // });

});
