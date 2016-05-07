var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.addColumn('employees', 'subcontractor_id', { type: 'int', unique: false }, createIndexes);

   function createIndexes(err) {
   if (err) { callback(err); return; }
   async.series([
      db.addIndex.bind(db, 'employees', 'employeeSubcontractorIdIndex', 'subcontractor_id' )
    ], callback);

  }
};

exports.down = function(db, callback) {
  db.removeColumn('employees', 'subcontractor_id', callback);
};
