'use strict';

var AWS = require('aws-sdk');
var s3Stream = require('s3-upload-stream')(new AWS.S3());

var CoAWS = require('co-aws-sdk');

var fs = require('fs');
var zlib = require('zlib');


var S3_BUCKET = require('../consts').S3_BUCKET;
var S3_OPTIONS = require('../consts').S3_OPTIONS;
// var S3_CLIENT_OPTIONS = require('../consts').S3_CLIENT_OPTIONS;

var stream = require('stream');

var moment = require('moment');

import * as Subcontractor from '../models/subcontractor';
import * as Employee from '../models/employee';


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
    yield Subcontractor.save(
      {
        user_id: parseInt(this.state.user.id),
        name: name
      }
    );

    this.response.status = 200;
    this.body = { "result": "subcontractor successfully added", "subcontractor" : subcontractor};
  }
})


//delete a subcontractor
.delete('/subcontractors/:subcontractor_id', function *(next) {
  var subcontractorToLoad =
  yield Subcontractor.load({ id: parseInt(this.params.subcontractor_id)});
  // check that the subcontractor exists and belongs to the user
  if(subcontractorToLoad.user_id != this.state.user.id) {
    this.response.status = 403;
    this.body = { "error" : "the subcontractor does not belong to currenty authenticated user"};
  } else {
    //check if there are any employees assigned to this subcontractor
    var employees = yield Employee.loadAllForSubcontractor(subcontractorToLoad.id);

    if(employees.length > 0) {
      this.response.status = 422;
      this.body = { "error" : "subcontractor can not be deleted, because it has active employees"};
    } else {
      yield Subcontractor.destroy(subcontractorToLoad);

      this.response.status = 200;
      this.body = { "result" : "subcontractor deleted"};
    }
  }
})



// get all subcontractors for current user
.get('/subcontractors', function *(next) {
  var subcontractors = yield Subcontractor.loadAllForUser(this.state.user.id);
  this.response.status = 200;
  this.body = { "subcontractors" : subcontractors };
})


// get subcontractor details
.get('/subcontractors/:subcontractor_id', function *(next) {
  var subcontractorToLoad =
  yield Subcontractor.load({ id: this.params.subcontractor_id});
  if (subcontractorToLoad.user_id != this.state.user.id) {
    this.response.status = 403;
    this.body = { "error" : "the subcontractor does not belong to currenty authenticated user"};
  } else {
    this.response.status = 200;
    this.body = { "result" : "subcontractor loaded", "subcontractor" : subcontractorToLoad };
  }
})

// update a subcontractor
.put('/subcontractors/:subcontractor_id', function *(next) {
  let data = this.request.body;
  var subcontractorToLoad =
  yield Subcontractor.load({ id: parseInt(this.params.subcontractor_id)});
  if(subcontractorToLoad.user_id != this.state.user.id) {
    this.response.status = 403;
    this.body = { "error" : "the subcontractor does not belong to currenty authenticated user"};
  } else {
    var subcontractor =
    yield Subcontractor.save({ id: parseInt(this.params.subcontractor_id),
      user_id: parseInt(this.state.user.id),
      name: data.name,
      coi_expires_at: data.coi_expires_at
    });
    this.response.status = 200;
    this.body = { "result": "subcontractor successfully updated"};
  }
})

//upload COI from IOS or android
.post('/subcontractors/:subcontractor_id/coi', function *(next) {
  var body =
  JSON.stringify(this.request.body, null, 2)
  // JSON.stringify(this.request.body)

  // console.log("request: ", this.request)
  // console.log("body: ", body)


  var subcontractorToLoad =
  yield Subcontractor.load({ id: this.params.subcontractor_id});

  if(subcontractorToLoad.user_id != this.state.user.id) {
    this.response.status = 403;
    this.body = { "error" : "the subcontractor does not belong to currenty authenticated user"};
  } else {
    let subcontractor_id = this.params.subcontractor_id;
    var file     = this.request.body.files.coi.path;
    var fileName = this.request.body.files.coi.name;

    var read = fs.createReadStream(file);
    var upload = s3Stream.upload({
      Bucket: S3_BUCKET,
      Key: 'i/' + fileName
    });
    upload.concurrentParts(10);
    read.pipe(upload);

    this.response.status = 200;
    this.body = { "result": "subcontractor CIO successfully uploaded"};
  }
})


//get COI
.get('/subcontractors/:subcontractor_id/coi', function *(next) {
  var subcontractorToLoad =
  yield Subcontractor.load({ id: this.params.subcontractor_id});
  var subcontractor_id = subcontractorToLoad.id;

  if(subcontractorToLoad.user_id != this.state.user.id) {
    this.response.status = 403;
    this.body = { "error" : "the subcontractor does not belong to currenty authenticated user"};
  } else {

    var s3 = new AWS.S3();

    var params =
    {
      Bucket: S3_BUCKET,
      Key: 'i/' + subcontractor_id + '.png'
    };

    // var file = require('fs').createWriteStream(subcontractor_id.toString());
    // s3.getObject(params).createReadStream().pipe(file);

    var that = this;
    this.body = s3.getObject(params).createReadStream().
    on('data', function(d) {
    }).
    on('error', function() {
      that.response.status = 404;
    }).
    on('end', function() {
      that.response.status = 200;
    });//fs.createReadStream(subcontractor_id.toString());
  }
})

//get employees
.get('/subcontractors/:subcontractor_id/employees', function *(next) {
  var subcontractorToLoad =
  yield Subcontractor.load({ id: this.params.subcontractor_id});
  var subcontractor_id = subcontractorToLoad.id;

  if(subcontractorToLoad.user_id != this.state.user.id) {
    this.response.status = 403;
    this.body = { "error" : "the subcontractor does not belong to currenty authenticated user"};
  } else {
    var employees = yield Employee.loadAllForSubcontractor(subcontractor_id);
    this.response.status = 200;
    this.body = { "employees" : employees };
  }
})


//delete COI
.delete('/subcontractors/:subcontractor_id/coi', function *(next) {
  var subcontractorToLoad =
  yield Subcontractor.load({ id: this.params.subcontractor_id});
  var subcontractor_id = subcontractorToLoad.id;

  if(subcontractorToLoad.user_id != this.state.user.id) {
    this.response.status = 403;
    this.body = { "error" : "the subcontractor does not belong to currenty authenticated user"};
  } else {

    var s3 = new AWS.S3();

    var params =
    {
      Bucket: S3_BUCKET,
      Key: 'i/' + subcontractor_id + '.png'
    };

    s3.deleteObject(params, function (err, metadata) {
      if (err) {
        // Handle no object on cloud here
        conosole.log("unable to delete COI");
      } else {
        console.log("deleted COI");
      }
    });
    this.response.status = 200;
    this.body = { "result" : "received request to delete COI"};
  }
})


//check if COI existin in s3
.get('/subcontractors/:subcontractor_id/coi_exists', function *(next) {
  var subcontractorToLoad =
  yield Subcontractor.load({ id: this.params.subcontractor_id});
  var subcontractor_id = subcontractorToLoad.id;

  if(subcontractorToLoad.user_id != this.state.user.id) {
    this.response.status = 403;
    this.body = { "error" : "the subcontractor does not belong to currenty authenticated user"};
  } else {
    // var s3 = new AWS.S3();
    var s3 = new CoAWS.S3();

    var params =
    {
      Bucket: S3_BUCKET,
      Key: 'i/' + subcontractor_id + '.png'
    };

    try {
      var result = yield s3.headObject(params);
      this.response.status = 200;
      this.body = { "result" : "COI uploaded"};
      // yield next;
    } catch (err) {
      if(err.code == "NotFound") {
        this.response.status = 404;
        this.body = { "error" : err};
      } else {
        this.response.status = 500;
        this.body = { "error" : err};
      }
    }
  }

})

.routes();
