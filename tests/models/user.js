'use strict';

process.env.NODE_ENV = 'test'
const app = require('../../app.js');


var assert = require('assert');

import * as User from '../../models/user';

require('co-mocha');
var uuid = require('uuid');



describe('User model testing', function() {

  it('should assign id after being saved', function *() {
    var userEmail = uuid.v4() + "@example.com";
    var user =
    yield User.save({email: userEmail, password: 'secret'});
    assert(user.id);
  });

  it('should hash a password after save', function *() {
    var userEmail = uuid.v4() + "@example.com";
    var user =
    yield User.save({email: userEmail, password: 'secret'});
    assert.notEqual(user.password, 'secret');
  });

  it('should validate correct password', function *() {
    var userEmail = uuid.v4() + "@example.com";
    var user =
    yield User.save({password: 'secret', email: userEmail});
    assert(User.comparePassword('secret', user.password));
  });

  it('should not hash password for users with id', function *() {
    var userEmail = uuid.v4() + "@example.com";
    var user1 = yield User.save({email: userEmail, password: 'secret'});
    var user2 = yield User.save(user1);
    assert(User.comparePassword('secret', user1.password));
    assert(User.comparePassword('secret', user2.password));
    assert(user1.id);
    assert.equal(user1.id, user2.id);
  });

  it('should not validate wrong password', function *() {
    var userEmail = uuid.v4() + "@example.com";
    var user =
    yield User.save({password: 'secretwrong', email: userEmail});
    assert(!User.comparePassword('secret', user.password));
  });

  it('should validate user by email and password', function *() {
    var userEmail = uuid.v4() + "@example.com";
    var user =
    yield User.save({password: 'secret', email: userEmail});

    var validUser = {password: 'secret', email: userEmail};
    var invalidUserEmail = {password: 'secret', email: '1' + userEmail};
    var invalidUserPasword = {password: 'secret1', email: userEmail};

    assert.notEqual(yield User.validateUserAndGenerateToken(validUser), null);
    assert.equal(yield User.validateUserAndGenerateToken(invalidUserEmail), null);
    assert.equal(yield User.validateUserAndGenerateToken(invalidUserPasword), null);
  });

  it('should generate jwt while validating user by email and password', function *() {
    var userEmail = uuid.v4() + "@example.com";
    var user =
    yield User.save({password: 'secret', email: userEmail});

    var validUser = {password: 'secret', email: userEmail};

    var token = yield User.validateUserAndGenerateToken(validUser);

    assert(token.length > 10);

  });

});
