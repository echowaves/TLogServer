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
    console.log(user);
    assert(user.id);
  });

});
