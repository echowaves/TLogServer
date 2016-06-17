'use strict';

process.env.NODE_ENV = 'test'
const app = require('../../app.js');
var db = require('../../consts').DB;


var assert   = require('assert'),
    ActionCode = require('../../models/action_code');

require('co-mocha');
var uuid = require('uuid');



describe('ActionCode model testing', function() {
  before(function *() {
    //clean all action codes first
    db.action_codes.destroySync({});
  })

  it('should create an action_code', function *() {
    var actionCode = new ActionCode();
    assert.equal(typeof actionCode, 'object');
  });

  it('should store properties passed when instantiated', function *() {
    var code = uuid.v4();
    var description = uuid.v4();
    var actionCode =
      new ActionCode({
        code: code,
        description: description
      });
    assert.equal(actionCode.code, code);
    assert.equal(actionCode.description, description);
  });

  it('should assign id after being saved', function *() {
    var code = uuid.v4();
    var description = uuid.v4();
    var actionCode =
      new ActionCode({
        code: code,
        description: description
      });
    yield actionCode.save.bind(actionCode);
    assert(actionCode.id);
  });

  it('should load by id after being saved', function *() {
    var code = uuid.v4();
    var description = uuid.v4();
    var actionCode =
      new ActionCode({
        code: code,
        description: description
      });
    yield actionCode.save.bind(actionCode);

    var actionCode1 =
      new ActionCode({
        id: actionCode.id
      });
    yield actionCode1.load.bind(actionCode1);
    assert.deepEqual(actionCode, actionCode1);

  });

  it('should lookup action code', function *() {
    //clean all action codes first
    var actionCode =
      new ActionCode({});
    yield actionCode.delete.bind(actionCode);

    var actionCode1 =
      new ActionCode({
        code: "5225",
        description: "Reinforcing Steel Installation"
      });
    yield actionCode1.save.bind(actionCode1);
    var actionCode2 =
      new ActionCode({
        code: "5403",
        description: "Carpentry–low wage"
      });
    yield actionCode2.save.bind(actionCode2);
    var actionCode3 =
      new ActionCode({
        code: "5432",
        description: "Carpentry–high wage"
      });
    yield actionCode3.save.bind(actionCode3);

    var foundCodes = yield actionCode.lookup.bind(actionCode, "car");
    assert(foundCodes.length == 2);
    assert(foundCodes[0].code == "5403");
    assert(foundCodes[1].code == "5432");

    foundCodes = yield actionCode.lookup.bind(actionCode, "225");
    assert(foundCodes.length == 1);
    assert(foundCodes[0].code == "5225");
  });
});
