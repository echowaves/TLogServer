var _ = require('lodash');
var massive = require("massive");
// var pg = require('pg');

var DB_CONNECTION = require('../consts').DB_CONNECTION;


var SCHEMA = ['userName' , 'password', 'email'];

var User = function(properties) {
  _.assign(this, properties);
}

User.prototype.save = function *() {
  var results = [],
      data    = _.pick(this, SCHEMA);

console.log('connection: ' + DB_CONNECTION);

  // if(this.id) {

  var db = massive.connectSync({connectionString: DB_CONNECTION});

  console.log('connected: ' + db);
  db.users.save({email : "new@example.com"}, function(err,inserted){
    console.log("error: " + err);
    //the new record with the ID
    console.log('inserted: ' + inserted);
  });


  // }

}

module.exports = User;
