'use strict';
var uuid = require('uuid');

var ActionCode   = require('../models/action_code');

module.exports = require('koa-router')()

// this should not be exposed
// get all action codes
// .get('/actioncodes', function *(next) {
//   var results = new ActionCode().loadAll();
//
//   this.response.status = 200;
//   this.body = { "result" : results };
// })


// get action code by id
.get('/actioncodes/:action_code_id', function *(next) {
  var actionCodeToLoad = new ActionCode({ id: this.params.action_code_id});
  actionCodeToLoad.load();

  this.response.status = 200;
  this.body = { "result" : actionCodeToLoad };
})

// lookup
.get('/actioncodes/lookup/:lookup_string', function *(next) {
  var results = new ActionCode().lookup(this.params.lookup_string);

  this.response.status = 200;
  this.body = { "actionCodes" : results };
})

// list all action codes specific to employee
.get('/employees/:employee_id/actioncodes', function *(next) {
  var results = new ActionCode().loadAllForEmployee(this.params.employee_id);

  this.response.status = 200;
  this.body = { "actionCodes" : results };
})


.routes();
