'use strict';

var massive = require("massive");

var _ = require('lodash');

var db = require('../consts').DB;



var Subcontractor = function(properties) {
  _.assign(this, properties);
}


// set id to the subcontracgtor obejct, call load to populate the rest of the properties

Subcontractor.prototype.load = function (callback) {
  var sub = db.subcontractors;
  var that = this;
// mbk
  db.subcontractors.findOne({id:this.id}, function(err, res){
    if(err) {
      console.log("error");
      console.log(err);
      callback(err, res);
      return;
    }
    //full product with new id returned
    if(res) {
      _.assign(that, res);
    }
    callback(err, res);
  }
)}
// mbk

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
  // console.log(this);
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
