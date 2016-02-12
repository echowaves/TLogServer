'use strict';

var _ = require('lodash');
var massive = require("massive");
var bcrypt  = require('bcrypt');
var jwt = require('koa-jwt');
var SECRET = require('../consts').SECRET;

var db = require('../consts').DB;

var User = function(properties) {
  _.assign(this, properties);
}

// only hash password if it's not yet hashed
User.prototype.hashPassword = function () {
  if(!this.password.startsWith('$2a$10$')) {
    var salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  }
}

User.prototype.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
}

// return token if user is found by email and password
User.prototype.validateUserAndGenerateToken = function (email, password) {
  var foundUser = db.users.findOneSync({email: email});
  if(!foundUser) {
    return null;
  }
  this.password = foundUser.password;
  if(this.comparePassword(password)) {
    return jwt.sign(foundUser, SECRET, { expiresIn: '7d' });
  };
  return null;
}

// upsert user
User.prototype.save = function () {
  this.hashPassword();
  var inserted = db.users.saveSync(this);
    if(!this.id) {
      this.id = inserted.id; // assign newly generated id to the object
    }
}


User.prototype.delete = function () {
  db.users.destroySync(this);
}

module.exports = User;
