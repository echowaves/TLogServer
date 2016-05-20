'use strict';

console.log(1);
var AWS = require('aws-sdk');
var fs = require('fs');
var zlib = require('zlib');

console.log(2);
var body = fs.createReadStream("/Users/dmitry/hacks/tlog/TLogServer/assets/logo-big.png").pipe(zlib.createGzip());
console.log(3);


var s3obj = new AWS.S3(
  {params:
    {
      Bucket: 'tlog-coi-test',
      Key: 'i/img.png.gzip'
    }
  });

console.log(4);

s3obj.upload({Body: body})
  .on('httpUploadProgress', function(evt) {
    console.log(evt);
  })
  .send(function(err, data) {
    console.log(err, data);
    console.log(5);
  });

console.log(6);
