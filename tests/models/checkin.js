process.env.NODE_ENV = 'test'
const app = require('../../app.js');


var assert   = require('assert');

import * as Checkin from '../../models/checkin';

require('co-mocha');
var uuid = require('uuid');

var moment = require('moment');



describe('Checkin model testing', function() {


  it('should assign id after being saved', function *() {
    var email = uuid.v4() + "@example.com";
    var user_id = 1;
    var checked_in_at = moment().toDate();
    var duration = moment.duration(3, 'hours').asSeconds();
    var action_code_id = 1;
    var checkin =
    yield Checkin.save({
      email: email,
      user_id: user_id,
      checked_in_at: checked_in_at,
      duration: duration,
      action_code_id: action_code_id
    });
    assert(checkin.id);
  });

  it('should load by id after being saved', function *() {
    var email = uuid.v4() + "@example.com";
    var user_id = 1;
    var checked_in_at = moment().toDate();
    var duration = moment.duration(3, 'hours').asSeconds();
    var action_code_id = 1;
    var checkin =
    yield Checkin.save({
      email: email,
      user_id: user_id,
      checked_in_at: checked_in_at,
      duration: duration,
      action_code_id: action_code_id
    });
    var checkin1 =
    yield Checkin.load({
      id: checkin.id
    });
    assert.deepEqual(checkin, checkin1);
  });

});
