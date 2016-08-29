process.env.NODE_ENV = 'test'
const app = require('../../app.js');

var moment = require('moment');

var assert   = require('assert'),
    User     = require('../../models/user');

import * as Subcontractor from '../../models/subcontractor';

require('co-mocha');
var uuid = require('uuid');



describe('Subcontractor model testing', function() {
  var user;

  beforeEach(function *() {
    var userEmail = uuid.v4() + "@example.com";
    user = new User({email: userEmail, password: 'secret'});
    yield user.save.bind(user);
  });


  it('should assign id after being saved', function *() {
    var coiExpitersAt = moment().add(12, 'M').format();
    var subcontractor =
    yield Subcontractor.save({
      user_id: user.id,
      name: "John Smith",
      coi_expires_at: coiExpitersAt});
    assert(subcontractor.id);
  });


  it('should return all subcontractors that belong to a user', function *() {
    var coiExpitersAt = moment().add(12, 'M').format();
    var subcontractor =
        yield Subcontractor.save({
          user_id: user.id,
          name: "John Smith",
          coi_expires_at: coiExpitersAt});

    var coiExpitersAt2 = moment().add(11, 'M').format();
    var subcontractor2 =
        yield Subcontractor.save({
          user_id: user.id,
          name: "John Smith",
          coi_expires_at: coiExpitersAt2});

    var subcontractors = yield Subcontractor.loadAllForUser(user.id);
    assert(Array.isArray(subcontractors), "must be array");
    assert(subcontractors.length == 2, "array size must be 2");
  });

});
