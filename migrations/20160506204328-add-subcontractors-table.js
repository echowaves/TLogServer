var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
  db.createTable('subcontractors', {
     id:              { type: 'int', primaryKey: true, autoIncrement: true },
     name:            {type: 'string', notNull: true,  unique: false },
     coi_expires_at:  { type: 'timestamp with time zone',   notNull: true },
   }, createIndexes);

   function createIndexes(err) {
   if (err) { callback(err); return; }
   async.series([
      db.addIndex.bind(db, 'subcontractors', 'subcontractorsCoiExpirationIndex', 'coi_expires_at' ),
    ], callback);

  }
};

exports.down = function(db, callback) {
  db.dropTable('subcontractors', callback);
};
