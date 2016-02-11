var _ = require('lodash');
var massive = require("massive");
var bcrypt  = require('bcrypt');

var db = require('../consts').DB;

var User = function(properties) {
  _.assign(this, properties);
}

User.prototype.hashPassword = function () {
  if(!this.password.startsWith('$2a$10$')) {
    var salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  }
}

User.prototype.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
}

User.prototype.save = function () {
  this.hashPassword();
  var inserted = db.users.saveSync(this);
    if(!this.id) {
      this.id = inserted.id; // assign newly generated id to the object
    }
  // yield;
}

module.exports = User;
