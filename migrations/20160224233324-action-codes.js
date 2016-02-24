var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
  db.createTable('action_codes', {
     id:              {type: 'int', primaryKey: true, autoIncrement: true },
     code:            {type: 'tsvector', notNull: true},
     description:     {type: 'tsvector', notNull: true},
   }, callback);

};

exports.down = function(db, callback) {
  db.dropTable('action_codes', callback);
};
