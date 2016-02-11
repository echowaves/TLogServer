var _ = require('lodash');
var massive = require("massive");
var bcrypt  = require('bcrypt');
var jwt = require('koa-jwt');
var SECRET = require('../consts').SECRET;

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

User.prototype.validateUserAndGenerateToken = function (email, password) {
  var foundUser = db.users.findOneSync({email: email});
  if(!foundUser) {
    return null;
  }
  this.password = foundUser.password;
  if(this.comparePassword(password)) {
    foundUser.jwt = jwt.sign(foundUser, SECRET, { expiresIn: '7d' });
    new User(foundUser).save();
    return foundUser.jwt;
  };
  return null;
}

User.prototype.save = function () {
  this.hashPassword();
  var inserted = db.users.saveSync(this);
    if(!this.id) {
      this.id = inserted.id; // assign newly generated id to the object
    }
}

User.prototype.findByToken = function (jwt) {
  var foundUser = db.users.findOneSync({jwt: jwt});
    if(foundUser) {
        _.assign(this, foundUser);
    }
}


User.prototype.delete = function () {
  db.users.destroySync(this);
}

module.exports = User;
