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
User.prototype.validateUserAndGenerateToken = function (callback) {
  var that = this;
  var foundUser = db.users.findOne({email: this.email}, function(err, res){
    if(err) {
      console.log("error User.prototype.validateUserAndGenerateToken");
      console.log(err);
      callback(err, res);
      return;
    }
    //full product with new id returned
    if(res == null) {
      callback(err, res);
      return;
    }
    var jwtUser = {
      id: res.id,
      email: res.email
    };
    var user = new User(res);
    var passwordsMatch = user.comparePassword(that.password);

    if(passwordsMatch) {
      callback(null, jwt.sign(jwtUser, SECRET, { expiresIn: '30d' }));
      return;
    };
    callback(err, null);
  });
}

// set id to the user object, call load to populate the rest of the properties
User.prototype.load = function (callback) {
  var that = this;
  db.users.findOne(this.id, function(err, res){
    if(err) {
      console.log("error User.prototype.load");
      console.log(err);
      callback(err, res);
      return;
    }
    //full product with new id returned
    if(res) {
      _.assign(that, res);
      delete that.password;
    }
    callback(err, res);
  });
}

// upsert user
User.prototype.save = function (callback) {
  var that = this;

  this.hashPassword();

  db.users.save(this, function(err, res) {
    if(err) {
      console.log("error User.prototype.save");
      console.log(err);
      callback(err, res);
      return;
    }
      if(res) {
        _.assign(that, res);
      }
      callback(err, res);
  });
}

// update
User.prototype.update = function (callback) {
  var that = this;
  this.hashPassword();

  db.users.update({id: that.id}, that,  function(err, res){
    if(err) {
      console.log("error User.prototype.update");
      console.log(err);
      callback(err, res);
      return;
    };
    //full product with new id returned
    if(res) {
      _.assign(that, res);
    };
    callback(err, res);
  });
}


// //delete a user (no user should ever be deleted)
// User.prototype.delete = function () {
//   db.users.destroySync({id: this.id});
// }

module.exports = User;
