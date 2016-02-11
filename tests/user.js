var assert = require('assert'),
    User   = require('../models/user');

require('co-mocha');

describe('User model testing', function() {

  it('should create a user', function *() {
    var user = new User();
    assert.equal(typeof user, 'object');
  });

  it('should store properties passed when instantiated', function *() {
    var userName = 'james';
    var user = new User({userName: userName});
    assert.equal(user.userName, userName);
  });

  it('should assign id after being saved', function *() {
    var user = new User({userName: 'james', password: 'secret', email: 'e@example.com'});
    user.save();
    assert(user.id);
  });

  it('should hash a password after save', function *() {
    var user = new User({userName: 'james', password: 'secret'});
    user.save();
    assert.notEqual(user.password, 'secret');
  });

  it('should not hash already hasshed password', function *() {
    var user = new User({password: 'secret'});
    user.hashPassword();
    assert(user.comparePassword('secret'));
    user.hashPassword();
    user.hashPassword();
    assert(user.comparePassword('secret'));
  });
});
