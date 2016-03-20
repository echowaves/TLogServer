var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
  db.createTable('employees_action_codes', {
     id:              { type: 'int', primaryKey: true, autoIncrement: true },
     employee_id:     { type: 'int',   notNull: true },
     action_code_id:  { type: 'int',   notNull: true }
   }, createIndexes);

   function createIndexes(err) {
   if (err) { callback(err); return; }
   async.series([
      db.addIndex.bind(db, 'employees_action_codes', 'employeeActionCodeAllIndex', ['employee_id', 'action_code_id'], {unique: true} ),
    ], callback);

  }
};

exports.down = function(db, callback) {
  db.dropTable('employees_action_codes', callback);
};
