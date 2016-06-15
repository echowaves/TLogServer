'use strict';

process.env.NODE_ENV = 'test'
const app = require('../../app.js');


var assert   = require('assert'),
    Checkin = require('../../models/checkin');

require('co-mocha');
var uuid = require('uuid');

var moment = require('moment');



describe('Checkin model testing', function() {

  it('should create an checkin', function *() {
    var checkin = new Checkin();
    assert.equal(typeof checkin, 'object');
  });

  it('should store properties passed when instantiated', function *() {
    var email = uuid.v4() + "@example.com";
    var user_id = 1;
    var checked_in_at = moment().toDate();
    var duration = moment.duration(3, 'hours').asSeconds();
    var action_code_id = 1;
    var checkin =
      new Checkin({
        email: email,
        user_id: user_id,
        checked_in_at: checked_in_at,
        duration: duration,
        action_code_id: action_code_id
      });
    assert.equal(checkin.email, email);
    assert.equal(checkin.user_id, user_id);
    assert.equal(checkin.checked_in_at, checked_in_at);
    assert.equal(checkin.duration, duration);
    assert.equal(checkin.action_code_id, action_code_id);
  });

  it('should assign id after being saved', function *() {
    var email = uuid.v4() + "@example.com";
    var user_id = 1;
    var checked_in_at = moment().toDate();
    var duration = moment.duration(3, 'hours').asSeconds();
    var action_code_id = 1;
    var checkin =
      new Checkin({
        email: email,
        user_id: user_id,
        checked_in_at: checked_in_at,
        duration: duration,
        action_code_id: action_code_id
      });
    yield checkin.save.bind(checkin);
    assert(checkin.id);
  });

  it('should load by id after being saved', function *() {
    var email = uuid.v4() + "@example.com";
    var user_id = 1;
    var checked_in_at = moment().toDate();
    var duration = moment.duration(3, 'hours').asSeconds();
    var action_code_id = 1;
    var checkin =
      new Checkin({
        email: email,
        user_id: user_id,
        checked_in_at: checked_in_at,
        duration: duration,
        action_code_id: action_code_id
      });
    yield checkin.save.bind(checkin);
    var checkin1 =
      new Checkin({
        id: checkin.id
      });
    checkin1.load();
    assert.deepEqual(checkin, checkin1);
  });

});
