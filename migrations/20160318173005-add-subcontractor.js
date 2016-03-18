var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.addColumn('employees', 'is_subcontractor', { type: 'boolean',   notNull: true,  defaultValue: false }, createIndexes);

   function createIndexes(err) {
   if (err) { callback(err); return; }
   async.series([
      db.addIndex.bind(db, 'employees', 'employeeIsSubcontractorIndex', 'is_subcontractor' )
    ], callback);

  }
};

exports.down = function(db, callback) {
  db.removeColumn('employees', 'is_subcontractor', callback);
};
