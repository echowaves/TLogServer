var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('users', {
     id: { type: 'int', primaryKey: true, autoIncrement: true },
     userName: 'string',
     password: 'string',
     email: {type: 'string', notNull: true, unique: true },
     jwt: 'string'
   }, addJwtIndex);

   function addJwtIndex(err) {
     if (err) { callback(err); return; }
     db.addIndex('users', 'jwtIndex', 'jwt', callback);
   };

};

exports.down = function(db, callback) {
  db.dropTable('users', callback);
};
