process.env.NODE_ENV = 'test'
const app = require('../../app.js');

var db = require('../../consts').DB;

import * as ActionCode from '../../models/action_code';
import * as EmployeesActionCode from '../../models/employees_action_code';

var assert   = require('assert');

require('co-mocha');
var uuid = require('uuid');



describe('EmployeesActionCode model testing', function() {

  beforeEach(function *() {
    //clean all action codes first
    db.employees_action_codes.destroySync({});
    db.action_codes.destroySync({});
  })


  it('should assign id after being saved', function *() {
    var employee_id = 3;
    var action_code_id = 4;
    var actionCode =
    yield EmployeesActionCode.save({
      employee_id: employee_id,
      action_code_id: action_code_id
    });
    assert(actionCode.id);
  });

  it('should load ActionCodes for employee', function *() {
    var description = "testing action code";
    var actionCode =
    yield ActionCode.save({
      code: "001",
      description: description
    });

    var employee_id = 3;
    var action_code_id = actionCode.id;
    var employeesActionCode =
    yield EmployeesActionCode.save({
      employee_id: employee_id,
      action_code_id: action_code_id
    });
    var actionCodes = yield ActionCode.loadAllForEmployee({employee_id});
    assert(actionCodes.length == 1);
  });
});
