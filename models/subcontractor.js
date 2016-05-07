'use strict';

var _ = require('lodash');
var massive = require("massive");

var db = require('../consts').DB;

var Subcontractor = function(properties) {
  _.assign(this, properties);
}


// set id to the subcontracgtor obejct, call load to populate the rest of the properties
Subcontractor.prototype.load = function () {
  var foundSubcontractor = db.subcontractors.findOneSync({id: this.id});
  if(foundSubcontractor) {
    _.assign(this, foundSubcontractor);
    return this;
  } else {
    return null;// this is error
  }
}

//load all subcontractors for user
Subcontractor.prototype.loadAllForUser = function (user_id) {
  var foundSubcontractors = db.subcontractors.findSync({user_id: user_id}, {order: "name asc"});
  var subcontractors = [];
  foundSubcontractors.forEach(function(item){
    var subcontractor = new Subcontractor();
    _.assign(subcontractor, item);
    subcontractors.push(subcontractor);
  });
  return subcontractors;
}

// upsert employee
Subcontractor.prototype.save = function () {
  var inserted = db.subcontractors.saveSync(this);

    if(!this.id) {
      this.id = inserted.id; // assign newly generated id to the object
    }
}

//delete a subcontractor
Subcontractor.prototype.delete = function () {
  db.subcontractors.destroySync({id: this.id});
}

module.exports = Subcontractor;
