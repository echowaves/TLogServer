'use strict';

var moment = require('moment');

var Subcontractor   = require('../models/subcontractor');
var Employee   = require('../models/employee');

module.exports = require('koa-router')()

//create a new subcontractor
.post('/subcontractors', function *(next) {
  let data = this.request.body;
  var name = data.name;

  if(!name) {
    this.response.status = 400;
    this.body = { "error": "missing parameter"};
  } else {
    var subcontractor =
    new Subcontractor(
      { user_id: this.state.user.id,
        name: name
      });
      subcontractor.save();

      this.response.status = 200;
      this.body = { "result": "subcontractor successfully added", "subcontractor" : subcontractor};
    }
  })


//delete a subcontractor
.delete('/subcontractors/:subcontractor_id', function *(next) {
  var subcontractorToLoad =
    new Subcontractor({ id: this.params.subcontractor_id});
  subcontractorToLoad.load();
  // check that the subcontractor exists and belongs to the user
  if(subcontractorToLoad.user_id != this.state.user.id) {
    this.response.status = 403;
    this.body = { "error" : "the subcontractor does not belong to currenty authenticated user"};
  } else {
    //check if there are any employees assigned to this subcontractor
    var employee = new Employee();
    employee.subcontractor_id = subcontractorToLoad.id;
    var employees = employee.loadAllForSubcontractor();

    if(employees.length > 0) {
      this.response.status = 422;
      this.body = { "error" : "subcontractor can not be deleted, because it has active employees"};
    } else {
      subcontractorToLoad.delete();

      this.response.status = 200;
      this.body = { "result" : "subcontractor deleted"};
    }
  }
})



// get all subcontractors for current user
.get('/subcontractors', function *(next) {
  var subcontractor = new Subcontractor();
  var subcontractors = subcontractor.loadAllForUser(this.state.user.id);
  this.response.status = 200;
  this.body = { "subcontractors" : subcontractors };
})


// get subcontractor details
.get('/subcontractors/:subcontractor_id', function *(next) {
  var subcontractorToLoad = new Subcontractor({ id: this.params.subcontractor_id});
  subcontractorToLoad.load();

  if(subcontractorToLoad.user_id != this.state.user.id) {
    this.response.status = 403;
    this.body = { "error" : "the subcontractor does not belong to currenty authenticated user"};
  } else {
    this.response.status = 200;
    this.body = { "result" : subcontractorToLoad };
  }
})

// update a subcontractor
.put('/subcontractors/:subcontractor_id', function *(next) {
  let data = this.request.body;
  var subcontractorToLoad = new Subcontractor({ id: this.params.subcontractor_id});
  subcontractorToLoad.load();

  if(subcontractorToLoad.user_id != this.state.user.id) {
    this.response.status = 403;
    this.body = { "error" : "the subcontractor does not belong to currenty authenticated user"};
  } else {
    var subcontractor =
      new Subcontractor(
        { id: this.params.subcontractor_id,
          user_id: this.state.user.id,
          name: data.name,
          coi_expires_at: data.coi_expires_at
        });
    subcontractor.save();

    this.response.status = 200;
    this.body = { "result": "subcontractor successfully updated"};
  }


})

// //upload COI
// .post('/employees/:employee_id/coi', function *(next) {
//   var body = JSON.stringify(this.request.body, null, 2)
//
//   let employee_id = this.params.employee_id;
//   console.log("employee_id: " + employee_id);
//
// console.log("body: " + body);
//
//
//   this.response.status = 200;
//   this.body = { "result": "employees CIO successfully uploaded"};
// })


.routes();
