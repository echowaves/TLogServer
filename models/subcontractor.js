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
  var findOneSub = thunkify(db.subcontractors.findOne);

  co(function *() {
    try {
      var res = yield findOneSub({id:this.id});
    } catch (err) {
      console.log(err);
    }
    console.log(res);
  })();
}

// try {
//   console.log(33333);
//   var res = yield findOne({id:this.id});
//   console.log(44444);
// } catch (err) {
//   console.log(55555);
//   console.log(err);
//  throw err;
// }
// console.log(66666);
//
// console.log(res);

  // , function(err, res){
  //   //full product with new id returned
  //   // console.log("subcontractor: ");
  //   // console.log(res);
  //   if(res) {
  //     _.assign(this, res);
  //     next();
  //   } else {
  //     next();
  //     // return null;// this is error
  //   }
  // });
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
