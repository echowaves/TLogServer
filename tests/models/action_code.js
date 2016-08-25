process.env.NODE_ENV = 'test'
const app = require('../../app.js');
var db = require('../../consts').DB;


import * as ActionCode from '../../models/action_code';

var assert   = require('assert');


require('co-mocha');
var uuid = require('uuid');



describe('ActionCode model testing', function() {
  before(function *() {
    //clean all action codes first
    db.action_codes.destroySync({});
  })


  it('should assign id after being saved', function *() {
    var code = uuid.v4();
    var description = uuid.v4();
    let results = yield ActionCode.save({
      code: code,
      description: description
    });
    assert(results.id);
  });

  it('should load by id after being saved', function *() {
    var code = uuid.v4();
    var description = uuid.v4();

    var actionCode =
    yield ActionCode.save({
      code: code,
      description: description
    });


    var actionCode1 =
    yield ActionCode.load({
      id: actionCode.id
    });
    assert.deepEqual(actionCode, actionCode1);

  });

  it('should lookup action code', function *() {


    var actionCode1 =
    yield ActionCode.save({
      code: "5225",
      description: "Reinforcing Steel Installation"
    });
    var actionCode2 =
    yield ActionCode.save({
      code: "5403",
      description: "Carpentry–low wage"
    });
    var actionCode3 =
    yield ActionCode.save({
      code: "5432",
      description: "Carpentry–high wage"
    });

    var foundCodes = yield ActionCode.lookup("car");
    assert(foundCodes.length == 2);
    assert(foundCodes[0].code == "5403");
    assert(foundCodes[1].code == "5432");

    foundCodes = yield ActionCode.lookup("225");
    assert(foundCodes.length == 1);
    assert(foundCodes[0].code == "5225");
  });
});
