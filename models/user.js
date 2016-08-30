var _ = require('lodash');
var massive = require("massive");
var bcrypt  = require('bcrypt');
var jwt = require('koa-jwt');
var SECRET = require('../consts').SECRET;

var db = require('../consts').DB;


// only hash password if it's not yet hashed
export function hashPassword(password) {
  // if(!this.id) {//hash only on insert
  return bcrypt.hashSync(password, 10);
  // }
}

export function comparePassword(plainText, password) {
  return bcrypt.compareSync(plainText, password);
}

// return token if user is found by email and password
export function validateUserAndGenerateToken(params) {
  return function(callback) {
    var foundUser = db.users.findOne({email: params.email}, function(err, res){
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

      var passwordsMatch = comparePassword(params.password, res.password);

      if(passwordsMatch) {
        callback(null, jwt.sign(jwtUser, SECRET, { expiresIn: '30d' }));
        return;
      };
      callback(err, null);
    });
  }
}

// set id to the user object, call load to populate the rest of the properties
export function load(params) {
  return function(callback) {
    db.users.findOne(params.id, function(err, res){
      if(err) {
        console.log("error User.prototype.load");
        console.log(err);
        callback(err, res);
        return;
      }
      //full product with new id returned
      if(res) {
        delete params.password;
      }
      callback(err, res);
    });
  }
}

// upsert user
export function save(params) {
  return function(callback) {
    //if this is an insert
    if(!params.id) {
      params.password = hashPassword(params.password);
    }

    db.users.save(params, function(err, res) {
      if(err) {
        console.log("error User.prototype.save");
        console.log(err);
        callback(err, res);
        return;
      }
      callback(err, res);
    });
  }
}


// //delete a user (no user should ever be deleted)
// User.prototype.delete = function () {
//   db.users.destroySync({id: this.id});
// }
