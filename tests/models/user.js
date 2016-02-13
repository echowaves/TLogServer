'use strict';

process.env.NODE_ENV = 'test'
const app = require('../../app.js');


var assert = require('assert'),
    User   = require('../../models/user');

require('co-mocha');

describe('User model testing', function() {

  beforeEach(function(done) {
    var user = new User();
    user.delete();// delete all users before each test run
    done();
  });


  it('should create a user', function *() {
    var user = new User();
    assert.equal(typeof user, 'object');
  });

  it('should store properties passed when instantiated', function *() {
    var userEmail = 'james@example.com';
    var user = new User({email: userEmail});
    assert.equal(user.email, userEmail);
  });

  it('should assign id after being saved', function *() {
    var user = new User({email: 'e@example.com', password: 'secret'});
    user.save();
    assert(user.id);
  });

  it('should hash a password after save', function *() {
    var user = new User({email: "blank@example.com", password: 'secret',});
    user.save();
    assert.notEqual(user.password, 'secret');
  });

  it('should not hash password for users with id', function *() {
    var user = new User({email: 'qwe@example.com', password: 'secret'});
    user.hashPassword();
    assert(user.comparePassword('secret'));
    user.id = 123;
    user.hashPassword();
    user.hashPassword();
    assert(user.comparePassword('secret'));
  });

  it('should validate correct password', function *() {
    var user = new User({password: 'secret', email: 'e@example.com'});
    user.save();
    assert(user.comparePassword('secret'));
  });

  it('should not validate wrong password', function *() {
    var user = new User({password: 'secretwrong', email: 'e@example.com'});
    user.save();
    assert(!user.comparePassword('secret'));
  });

  it('should validate user by email and password', function *() {
    var user = new User({password: 'secret', email: 'e@example.com'});
    user.save();

    assert.notEqual(new User().validateUserAndGenerateToken('e@example.com', 'secret'), null);
    assert.equal(new User().validateUserAndGenerateToken('e1@example.com', 'secret'), null);
    assert.equal(new User().validateUserAndGenerateToken('e@example.com', 'secret1'), null);
  });

  it('should generate jwt while validating user by email and password', function *() {
    var user = new User({password: 'secret', email: 'e@example.com'});
    user.save();

    var token = new User().validateUserAndGenerateToken('e@example.com', 'secret');

    assert(token.length > 10);

  });

});
