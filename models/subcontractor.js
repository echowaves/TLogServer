'use strict';

var co = require('co');
var thunkify = require('thunkify');

var massive = require("massive");

var _ = require('lodash');

var db = require('../consts').DB;



var Subcontractor = function(properties) {
  _.assign(this, properties);
}


// set id to the subcontracgtor obejct, call load to populate the rest of the properties

Subcontractor.prototype.load = function () {
  var findOne = thunkify(db.subcontractors.findOne);

  co(function *() {
    var res = yield findOne({id:this.id});
    console.log(res);
    return res;
  }).then(function (value) {
    console.log(value);
  }, function (err) {
    console.error(err.stack);
  });
}

//
// // return function (done) {
//   db.subcontractors.findOne({id:this.id}, function(err, res){
//     if(err) {
//       console.log("error");
//       console.log(err);
//       return;
//       // done(err);
//     }
//     //full product with new id returned
//     if(res) {
//       _.assign(this, res);
//     }
//     console.log(res);
//     // done(err, res);
//   });
// // }
// }

//   var promise = new Promise(function(resolve, reject) {
//     db.subcontractors.findOne({id:this.id}, function(err, res){
//       if(err) {
//         console.log("error");
//         console.log(err);
//         reject(Error(err));
//       } else {
//       //full product with new id returned
//         _.assign(this, res);
//         resolve(res);
//       }
//     });
//   });
//   var subcontractor = yield promise;
//   console.log(subcontractor);
//
// }


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
