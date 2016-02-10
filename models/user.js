var _ = require('lodash');
var massive = require("massive");
// var pg = require('pg');

var db = require('../consts').DB;


var SCHEMA = ['userName' , 'password', 'email'];

var User = function(properties) {
  _.assign(this, properties);
}

User.prototype.save = function *() {
  var results = [],
      data    = _.pick(this, SCHEMA);

  // if(this.id) {
  console.log('connected: ' + db);
  db.users.save({email : "new@example.com"}, function(err,inserted){
    console.log("error: " + err);
    //the new record with the ID
    console.log('inserted: ' + inserted);
  });


  // }

}

module.exports = User;
