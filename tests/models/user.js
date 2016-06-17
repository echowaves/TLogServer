'use strict';

process.env.NODE_ENV = 'test'
const app = require('../../app.js');


var assert = require('assert'),
    User   = require('../../models/user');

require('co-mocha');
var uuid = require('uuid');



describe('User model testing', function() {

  it('should create a user', function *() {
    var user = new User();
    assert.equal(typeof user, 'object');
  });

  it('should store properties passed when instantiated', function *() {
    var userEmail = uuid.v4() + "@example.com";
    var user = new User({email: userEmail});
    assert.equal(user.email, userEmail);
  });

  it('should assign id after being saved', function *() {
    var userEmail = uuid.v4() + "@example.com";
    var user = new User({email: userEmail, password: 'secret'});
    yield user.save.bind(user);
    assert(user.id);
  });

  it('should hash a password after save', function *() {
    var userEmail = uuid.v4() + "@example.com";
    var user = new User({email: userEmail, password: 'secret',});
    yield user.save.bind(user);
    assert.notEqual(user.password, 'secret');
  });

  it('should not hash password for users with id', function *() {
    var userEmail = uuid.v4() + "@example.com";
    var user = new User({email: userEmail, password: 'secret'});
    user.hashPassword();
    assert(user.comparePassword('secret'));
    user.id = 123;
    user.hashPassword();
    user.hashPassword();
    assert(user.comparePassword('secret'));
  });

  it('should validate correct password', function *() {
    var userEmail = uuid.v4() + "@example.com";
    var user = new User({password: 'secret', email: userEmail});
    yield user.save.bind(user);
    assert(user.comparePassword('secret'));
  });

  it('should not validate wrong password', function *() {
    var userEmail = uuid.v4() + "@example.com";
    var user = new User({password: 'secretwrong', email: userEmail});
    yield user.save.bind(user);
    assert(!user.comparePassword('secret'));
  });

  it('should validate user by email and password', function *() {
    var userEmail = uuid.v4() + "@example.com";
    var user = new User({password: 'secret', email: userEmail});
    yield user.save.bind(user);

    var validUser = new User({password: 'secret', email: userEmail});
    var invalidUserEmail = new User({password: 'secret', email: '1' + userEmail});
    var invalidUserPasword = new User({password: 'secret1', email: userEmail});

    assert.notEqual(yield validUser.validateUserAndGenerateToken.bind(validUser), null);
    assert.equal(yield invalidUserEmail.validateUserAndGenerateToken.bind(invalidUserEmail), null);
    assert.equal(yield invalidUserPasword.validateUserAndGenerateToken.bind(invalidUserPasword), null);
  });

  it('should generate jwt while validating user by email and password', function *() {
    var userEmail = uuid.v4() + "@example.com";
    var user = new User({password: 'secret', email: userEmail});
    yield user.save.bind(user);

    var validUser = new User({password: 'secret', email: userEmail});

    var token = yield validUser.validateUserAndGenerateToken.bind(validUser);

    assert(token.length > 10);

  });

});
