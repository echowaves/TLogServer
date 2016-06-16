'use strict';

var db = require('../consts').DB;


var _ = require('lodash');

// var db = require('../consts').DB;

var Checkin = function(properties) {
  _.assign(this, properties);
}


// set id to the checkin object, call load to populate the rest of the properties
Checkin.prototype.load = function () {
  var found = db.checkins.findOneSync({id:this.id});
  if(found) {
    _.assign(this, found);
    return this;
  } else {
    return null;// this is error
  }
}

// set email address  to the checkin object (test covered only by route test)
Checkin.prototype.loadAll = function (page_number, page_size) {
  if(this.email == null)          { return null;};
  if(page_number == null)   { page_number = '0';};
  if(page_size == null)     { page_size = '100';};

  return db.runSync("SELECT c.id, c.email, c.user_id, c.checked_in_at, c.duration, c.action_code_id, a.code, a.description FROM checkins c INNER JOIN action_codes a ON c.action_code_id = a.id WHERE c.email=$1 ORDER BY c.checked_in_at desc LIMIT $2 OFFSET $3", [this.email, parseInt(page_size), parseInt(page_number) * parseInt(page_size)]);
}


// upsert checkin
Checkin.prototype.save = function (callback) {
  var that = this;
  db.checkins.save(that, function(err, res){
    if(err) {
      console.log("error Checkin.prototype.save");
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



// update checkin
Checkin.prototype.update = function (callback) {
  var that = this;
  db.checkins.update(that.id, that, function(err, res){
    if(err) {
      console.log("error Checkin.prototype.update");
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


//delete checkin
Checkin.prototype.delete = function () {
  db.checkins.destroySync({id: this.id});
}

module.exports = Checkin;
