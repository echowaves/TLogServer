var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
  db.createTable('employees', {
     id:              { type: 'int', primaryKey: true, autoIncrement: true },
     user_id:         { type: 'int',   notNull: true,  unique: false },
     name:            {type: 'string', notNull: true,  unique: false },
     email:           {type: 'string', notNull: true,  unique: true },
     activation_code: {type: 'string'}
   }, createIndexes);

   function createIndexes(err) {
   if (err) { callback(err); return; }
   async.series([
      db.addIndex.bind(db, 'employees', 'employeeUserIdIndex', 'user_id' ),
      db.addIndex.bind(db, 'employees', 'employeeNameIndex', 'name' ),
      db.addIndex.bind(db, 'employees', 'employeeActivationCodeIndex', 'activation_code' )
    ], callback);

  }
};

exports.down = function(db, callback) {
  db.dropTable('employees', callback);
};
