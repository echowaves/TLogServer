'use strict';

var _ = require('lodash');
var massive = require("massive");

var db = require('../consts').DB;

var ActionCode = function(properties) {
  _.assign(this, properties);
}


// lookup action codes by code and/or description
ActionCode.prototype.lookup = function (lookupString) {
  return db.runSync("select * from action_codes where code ilike $1 or description ilike $1", ['%' + lookupString + '%']);
}

// upsert actionCode
ActionCode.prototype.save = function () {
  var inserted = db.action_codes.saveSync(this);
    if(!this.id) {
      this.id = inserted.id; // assign newly generated id to the object
    }
}

//delete a actionCode
ActionCode.prototype.delete = function () {
  db.action_codes.destroySync(this);
}


module.exports = ActionCode;
