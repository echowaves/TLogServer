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

// set email address  to the checkin object (test covered only by route test)
Checkin.prototype.loadAll = function (page_number, page_size) {
  if(this.email == null)         { return null;};
  if(page_number == null)   { page_number = 0;};
  if(page_size == null)     { page_size = 100;};
  var options = {
    limit : page_size,
    order : "checked_in_at desc",
    offset: page_number * page_size
  }

  return db.checkins.findSync({email: this.email}, options);
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
