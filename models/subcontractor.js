'use strict';

var massive = require("massive");

var _ = require('lodash');

var db = require('../consts').DB;



var Subcontractor = function(properties) {
  _.assign(this, properties);
}


// set id to the subcontracgtor obejct, call load to populate the rest of the properties

Subcontractor.prototype.load = function (callback) {
  var that = this;
// mbk
  db.subcontractors.findOne({id:parseInt(this.id)}, function(err, res){
    if(err) {
      console.log("error Subcontractor.prototype.load");
      console.log(err);
      callback(err, res);
      return;
    };
    //full product with new id returned
    if(res) {
      // res = _.pickBy(res);
      _.assign(that, res);
      // console.log("res", res)
    };
    callback(err, res);
  });
}
// mbk

//load all subcontractors for user
Subcontractor.prototype.loadAllForUser = function (user_id, callback) {
  db.subcontractors.find({user_id: user_id}, {order: "name asc"} , function(err, foundSubcontractors) {
    if(err) {
      console.log("error Subcontractor.prototype.loadAllForUser");
      console.log(err);
      callback(err, res);
      return;
    };

    var subcontractors = [];
    foundSubcontractors.forEach(function(item){
      var subcontractor = new Subcontractor();
      _.assign(subcontractor, item);
      subcontractors.push(subcontractor);
    });
    callback(err, subcontractors);
  });
}

// upsert employee
Subcontractor.prototype.save = function (callback) {
  var that = this;
  db.subcontractors.save(_.omit(that, _.keys(_.pickBy(that,_.isFunction))), function(err, res) {
    if(err) {
      console.log("error Subcontractor.prototype.save");
      console.log(err);
      callback(err, res);
      return;
    }
      if(res) {
        _.assign(that, res);
      }
      callback(err, res);
  });
}


//delete a subcontractor
Subcontractor.prototype.delete = function (callback) {
  db.subcontractors.destroy({id: this.id}, function(err, res){
    if(err) {
      console.log("error Subcontractor.prototype.delete");
      console.log(err);
      callback(err, res);
      return;
    }
    callback(err, res);
  });
}


module.exports = Subcontractor;
