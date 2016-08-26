var db = require('../consts').DB;


var _ = require('lodash');

// var db = require('../consts').DB;


export function load(params) {
  return function(callback) {
    db.checkins.findOne(params, function(err, checkinRes) {
      if(err) {
        console.log("error Checkin.prototype.load");
        console.log(err);
        callback(err, checkinRes);
        return;
      };
      callback(err, checkinRes);
    });
  }
}

//(test covered only by route test)
export function loadAll(email, page_number, page_size) {
  return function(callback) {
    if(email == null)          {
      callback("email is missin", null);
      return;
    };
    if(page_number == null)   { page_number = '0';};
    if(page_size == null)     { page_size = '100';};

    db.run("SELECT c.id, c.email, c.user_id, c.checked_in_at, c.duration, c.action_code_id, a.code, a.description FROM checkins c INNER JOIN action_codes a ON c.action_code_id = a.id WHERE c.email=$1 ORDER BY c.checked_in_at desc LIMIT $2 OFFSET $3", [email, parseInt(page_size), parseInt(page_number) * parseInt(page_size)],
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
}

// upsert checkin
export function save(params) {
  return function(callback) {
    db.checkins.save(params, function(err, res){
      if(err) {
        console.log("error Checkin.save");
        console.log(err);
        callback(err, res);
        return;
      }
      callback(err, res);
    });
  }
}


//delete checkin
export function destroy(params) {
  return function(callback) {
    db.checkins.destroy(params, function(err, res){
      if(err) {
        console.log("error Checkin.delete");
        console.log(err);
        callback(err, res);
        return;
      }
      callback(err, res);
    });
  }
}
