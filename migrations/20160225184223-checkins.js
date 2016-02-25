var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
  db.createTable('checkins', {
     id:              { type: 'int', primaryKey: true, autoIncrement: true },
     email:           { type: 'string', notNull: true, unique: false },
     user_id:         { type: 'int',    notNull: true, unique: false },
     checked_in_at:   { type: 'datetime',   notNull: true, unique: false },
     checked_out_at:  { type: 'datetime',   notNull: true, unique: false },
     action_code_id:  { type: 'int',    notNull: true, unique: false }
   }, createIndexes);

   function createIndexes(err) {
   if (err) { callback(err); return; }
   async.series([
      db.addIndex.bind(db, 'checkins', 'checkinsEmailIndex',  'email' ),
      db.addIndex.bind(db, 'checkins', 'checkinsUserIdIndex', 'user_id' ),
      db.addIndex.bind(db, 'checkins', 'checkedInAtIndex',    'checked_in_at' ),
      db.addIndex.bind(db, 'checkins', 'actionCodeIndex',     'action_code_id' )
    ], callback);

  }
};

exports.down = function(db, callback) {
  db.dropTable('checkins', callback);
};
