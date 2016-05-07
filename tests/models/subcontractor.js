'use strict';

process.env.NODE_ENV = 'test'
const app = require('../../app.js');

var moment = require('moment');

var assert   = require('assert'),
    Subcontractor = require('../../models/subcontractor'),
    User     = require('../../models/user');

require('co-mocha');
var uuid = require('uuid');



describe('Subcontractor model testing', function() {
  var user;

  beforeEach(function () {
    var userEmail = uuid.v4() + "@example.com";
    user = new User({email: userEmail, password: 'secret'});
    user.save();
  });

  it('should create a subcontractor', function *() {
    var subcontractor = new Subcontractor();
    assert.equal(typeof subcontractor, 'object');
  });

  it('should store properties passed when instantiated', function *() {
    var coiExpitersAt = moment().add(12, 'M').format();
    var subcontractor =
      new Subcontractor({
        user_id: user.id,
        name: "John Smith",
        coi_expires_at: coiExpitersAt});
    assert.equal(subcontractor.user_id, user.id);
    assert.equal(subcontractor.name, "John Smith");
    assert.equal(subcontractor.coi_expires_at, coiExpitersAt);
  });

  it('should assign id after being saved', function *() {
    var coiExpitersAt = moment().add(12, 'M').format();
    var subcontractor =
      new Subcontractor({
        user_id: user.id,
        name: "John Smith",
        coi_expires_at: coiExpitersAt});
    subcontractor.save();
    assert(subcontractor.id);
  });


  it('should return all subcontractors that belong to a user', function *() {
    var coiExpitersAt = moment().add(12, 'M').format();
    var subcontractor =
      new Subcontractor({
        user_id: user.id,
        name: "John Smith",
        coi_expires_at: coiExpitersAt});
    subcontractor.save();

    var coiExpitersAt2 = moment().add(11, 'M').format();
    var subcontractor2 =
      new Subcontractor({
        user_id: user.id,
        name: "John Smith",
        coi_expires_at: coiExpitersAt2});
    subcontractor2.save();

    var subcontractors = subcontractor.loadAllForUser(user.id);
    assert(Array.isArray(subcontractors), "must be array");
    assert(subcontractors.length == 2, "array size must be 2");
  });

});
