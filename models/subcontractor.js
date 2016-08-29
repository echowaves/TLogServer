'use strict';

var massive = require("massive");

var _ = require('lodash');

var db = require('../consts').DB;


// set id to the subcontracgtor obejct, call load to populate the rest of the properties

export function load(params) {
  return function(callback) {
    db.subcontractors.findOne(params, function(err, res){
      if(err) {
        console.log("error Subcontractor.load");
        console.log(err);
        callback(err, res);
        return;
      };
      //full product with new id returned
      callback(err, res);
    });
  }
}

//load all subcontractors for user
export function loadAllForUser(user_id) {
  return function(callback) {
    db.subcontractors.find({user_id}, {order: "name asc"} , function(err, foundSubcontractors) {
      if(err) {
        console.log("error Subcontractor.loadAllForUser");
        console.log(err);
        callback(err, foundSubcontractors);
        return;
      };
      callback(err, foundSubcontractors);
    });
  }
}

// upsert employee
export function save(params) {
  return function(callback) {
    db.subcontractors.save(params, function(err, res) {
      if(err) {
        console.log("error Subcontractor.save");
        console.log(err);
        callback(err, res);
        return;
      }
      callback(err, res);
    });
  }
}

//delete a subcontractor
export function destroy(params) {
  return function(callback) {
    db.subcontractors.destroy(params, function(err, res){
      if(err) {
        console.log("error Subcontractor.delete");
        console.log(err);
        callback(err, res);
        return;
      }
      callback(err, res);
    });
  }
}
