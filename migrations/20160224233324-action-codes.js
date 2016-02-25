var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
  db.createTable('action_codes', {
     id:              {type: 'int', primaryKey: true, autoIncrement: true },
     code:            {type: 'string', notNull: true},
     description:     {type: 'string', notNull: true},
   }, createIndexes);

   function createIndexes(err) {
   if (err) { callback(err); return; }
   async.series([
      db.addIndex.bind(db, 'action_codes', 'action_codesCodeIndex', 'code' ),
      db.addIndex.bind(db, 'action_codes', 'action_codesDescriptionIndex', 'description', {unique: true} ),
    ], callback);
  }
};

exports.down = function(db, callback) {
  db.dropTable('action_codes', callback);
};
