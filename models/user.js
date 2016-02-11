var _ = require('lodash');
var massive = require("massive");
// var pg = require('pg');

var db = require('../consts').DB;

var User = function(properties) {
  _.assign(this, properties);
}

User.prototype.save = function () {
  var inserted = db.users.saveSync(this);
    if(!this.id) {
      this.id = inserted.id; // assign newly generated id to the object
    }
}

module.exports = User;
