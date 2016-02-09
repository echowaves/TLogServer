var assert = require('assert'),
    User   = require('../models/user');

require('co-mocha');

describe('User model testing', function() {
  it('should create a user', function *() {
    var user = new User();
    assert.equal(typeof user, 'object');
  })

  it('should store properties passed when instantiated', function *() {
    var userName, iser;
    userName = 'james';
    user = new User({userName: userName});
    assert.equal(user.userName, userName);
  })
});
