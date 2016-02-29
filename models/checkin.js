'use strict';

var _ = require('lodash');
var massive = require("massive");

var db = require('../consts').DB;

var Checkin = function(properties) {
  _.assign(this, properties);
}


// set id to the checkin object, call load to populate the rest of the properties
Checkin.prototype.load = function () {
  var found = db.checkins.findOneSync({id: this.id});
  if(found) {
    _.assign(this, found);
    return this;
  } else {
    return null;// this is error
  }
}


// upsert checkin
Checkin.prototype.save = function () {
  var inserted = db.checkins.saveSync(this);
    if(!this.id) {
      this.id = inserted.id; // assign newly generated id to the object
      _.assign(this, inserted);
    }
}

//delete checkin
Checkin.prototype.delete = function () {
  db.checkins.destroySync(this);
}

module.exports = Checkin;
