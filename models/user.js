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
  if(!this.id) {//hash only on insert
    this.password = bcrypt.hashSync(this.password, 10);
  }
}

User.prototype.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
}

// return token if user is found by email and password
User.prototype.validateUserAndGenerateToken = function () {
  var foundUser = db.users.findOneSync({email: this.email});
  if(foundUser == null) {
    return null;
  }
  var jwtUser = {
    id: foundUser.id,
    email: foundUser.email
  };
  var user = new User(foundUser);
  var passwordsMatch = user.comparePassword(this.password);

  if(passwordsMatch) {
    return jwt.sign(jwtUser, SECRET, { expiresIn: '30d' });
  };
  return null;
}

// set id to the user object, call load to populate the rest of the properties
User.prototype.load = function () {
  var foundUser = db.users.findOneSync({id: this.id});
  if(foundUser) {
    _.assign(this, foundUser);
    delete this.password; // we do not want to return password
    return this;
  } else {
    return null;// this is error
  }
}

// upsert user
User.prototype.save = function () {
  this.hashPassword();
  var inserted = db.users.saveSync(this);
    if(!this.id) {
      this.id = inserted.id; // assign newly generated id to the object
    }
}

// //delete a user (no user should ever be deleted)
// User.prototype.delete = function () {
//   db.users.destroySync(this);
// }

module.exports = User;
