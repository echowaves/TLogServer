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
    var checked_in_at = moment().millisecond();
    var checked_out_at = moment(checked_in_at).add(3, 'h');
    var action_code_id = 1;
    var checkin =
      new Checkin({
        email: email,
        user_id: user_id,
        checked_in_at: checked_in_at,
        checked_out_at: checked_out_at,
        action_code_id: action_code_id
      });
    assert.equal(checkin.email, email);
    assert.equal(checkin.user_id, user_id);
    assert.equal(checkin.checked_in_at, checked_in_at);
    assert.equal(checkin.checked_out_at, checked_out_at);
    assert.equal(checkin.action_code_id, action_code_id);
  });

  it('should assign id after being saved', function *() {
    var email = uuid.v4() + "@example.com";
    var user_id = 1;
    var checked_in_at = moment();
    var checked_out_at = moment(checked_in_at).add(3, 'h');
    var action_code_id = 1;
    var checkin =
      new Checkin({
        email: email,
        user_id: user_id,
        checked_in_at: checked_in_at,
        checked_out_at: checked_out_at,
        action_code_id: action_code_id
      });
    checkin.save();
    assert(checkin.id);
  });

  // it('should load by id after being saved', function *() {
  //   var code = uuid.v4();
  //   var description = uuid.v4();
  //   var actionCode =
  //     new ActionCode({
  //       code: code,
  //       description: description
  //     });
  //   actionCode.save();
  //
  //   var actionCode1 =
  //     new ActionCode({
  //       id: actionCode.id
  //     });
  //   actionCode1.load();
  //   assert.deepEqual(actionCode, actionCode1);
  //
  // });
  //
  // it('should lookup action code', function *() {
  //   //clean all action codes first
  //   var actionCode =
  //     new ActionCode({});
  //   actionCode.delete();
  //
  //   var actionCode1 =
  //     new ActionCode({
  //       code: "5225",
  //       description: "Reinforcing Steel Installation"
  //     });
  //   actionCode1.save();
  //   var actionCode2 =
  //     new ActionCode({
  //       code: "5403",
  //       description: "Carpentry–low wage"
  //     });
  //   actionCode2.save();
  //   var actionCode3 =
  //     new ActionCode({
  //       code: "5432",
  //       description: "Carpentry–high wage"
  //     });
  //   actionCode3.save();
  //
  //   var foundCodes = actionCode.lookup("car");
  //   assert(foundCodes.length == 2);
  //   assert(foundCodes[0].code == "5403");
  //   assert(foundCodes[1].code == "5432");
  //
  //   foundCodes = actionCode.lookup("225");
  //   assert(foundCodes.length == 1);
  //   assert(foundCodes[0].code == "5225");
  // });
});
