'use strict';

var db = require('../consts').DB;


var _ = require('lodash');

// var db = require('../consts').DB;

var Checkin = function(properties) {
  _.assign(this, properties);
}


// set id to the checkin object, call load to populate the rest of the properties
Checkin.prototype.load = function (callback) {
  var that = this;
  db.checkins.findOne({id:this.id}, function(err, checkinRes) {
    if(err) {
      console.log("error Checkin.prototype.load");
      console.log(err);
      callback(err, checkinRes);
      return;
    };
    _.assign(that, checkinRes);
    callback(err, checkinRes);
  });
}

// set email address  to the checkin object (test covered only by route test)
Checkin.prototype.loadAll = function (page_number, page_size, callback) {
  if(this.email == null)          {
    callback("email is missin", null);
    return;
  };
  if(page_number == null)   { page_number = '0';};
  if(page_size == null)     { page_size = '100';};

  db.run("SELECT c.id, c.email, c.user_id, c.checked_in_at, c.duration, c.action_code_id, a.code, a.description FROM checkins c INNER JOIN action_codes a ON c.action_code_id = a.id WHERE c.email=$1 ORDER BY c.checked_in_at desc LIMIT $2 OFFSET $3", [this.email, parseInt(page_size), parseInt(page_number) * parseInt(page_size)],
  function(err, checkinsRes) {
    if(err) {
      console.log("error Checkin.prototype.loadAll");
      console.log(err);
      callback(err, checkinsRes);
      return;
    };
    callback(err, checkinsRes);
  });
}


// upsert checkin
Checkin.prototype.save = function (callback) {
  var that = this;
  db.checkins.save(_.omit(that, _.keys(_.pickBy(that,_.isFunction))), function(err, res){
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


//delete checkin
Checkin.prototype.delete = function (callback) {
  db.checkins.destroy({id: this.id}, function(err, res){
    if(err) {
      console.log("error Checkin.prototype.delete");
      console.log(err);
      callback(err, res);
      return;
    }
    callback(err, res);
  });
}


module.exports = Checkin;
