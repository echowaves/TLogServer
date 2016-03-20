'use strict';

process.env.NODE_ENV = 'test'
const app = require('../../app.js');

var db = require('../../consts').DB;


var assert   = require('assert'),
    EmployeesActionCode = require('../../models/employees_action_code'),
    ActionCode = require('../../models/action_code');

require('co-mocha');
var uuid = require('uuid');



describe('EmployeesActionCode model testing', function() {

  beforeEach(function *() {
    //clean all action codes first
    db.employees_action_codes.destroySync({});
    db.action_codes.destroySync({});
  })

  it('should create an employees_action_code', function *() {
    var actionCode = new EmployeesActionCode();
    assert.equal(typeof actionCode, 'object');
  });

  it('should store properties passed when instantiated', function *() {
    var actionCode =
      new EmployeesActionCode({
        employee_id: 1,
        action_code_id: 2
      });
    assert.equal(actionCode.employee_id, 1);
    assert.equal(actionCode.action_code_id, 2);
  });

  it('should assign id after being saved', function *() {
    var employee_id = 3;
    var action_code_id = 4;
    var actionCode =
      new EmployeesActionCode({
        employee_id: employee_id,
        action_code_id: action_code_id
      });
    actionCode.save();
    assert(actionCode.id);
  });

  it('should load ActionCodes for employee', function *() {
    assert(new ActionCode().loadAllForEmployee(employee_id).length == 0);

    var description = "testing action code";
    var actionCode =
      new ActionCode({
        code: "001",
        description: description
      });
    actionCode.save();

    var employee_id = 3;
    var action_code_id = actionCode.id;
    var employeesActionCode =
      new EmployeesActionCode({
        employee_id: employee_id,
        action_code_id: action_code_id
      });
    employeesActionCode.save();
    assert(new ActionCode().loadAllForEmployee(employee_id).length == 1);
  });


});
