'use strict';

var massive = require("massive");

var db = require('./database.json');

module.exports = Object.freeze({
    SECRET: 'tradeogsha-secret',
    API_VERSION_ANDROID: '1.0.0',
    API_VERSION_IOS:     '1.0.0',
    DB: massive.connectSync(
      {connectionString:
        "postgres://" +
        process.env.TLOG_DB_USER + ":" +
        process.env.TLOG_DB_PASS + "@" +
        process.env.TLOG_DB_HOST  + "/" +
        process.env.TLOG_DB_NAME
      }),
    SEND_GRID_API_USER: process.env.TLOG_SEND_GRID_API_USER ,
    SEND_GRID_API_PASSWORD: process.env.TLOG_SEND_GRID_API_PASSWORD ,
    TL_HOST: process.env.TLOG_HOST,
    TL_TEST_MODE: process.env.TL_TEST_MODE || false,

    S3_BUCKET: process.env.TLOG_S3BUCKET,
    S3_OPTIONS: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      // any other options are passed to new AWS.S3()
      // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
      region: "US Standard",
    },
    // S3_CLIENT_OPTIONS: {
    //   maxAsyncS3: 14,     // this is the default
    //   s3RetryCount: 5,    // this is the default
    //   s3RetryDelay: 1000, // this is the default
    //   multipartUploadThreshold: 20971520, // this is the default (20 MB)
    //   multipartUploadSize: 15728640, // this is the default (15 MB)
    //   s3Options: {
    //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    //     // any other options are passed to new AWS.S3()
    //     // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
    //     region: "US Standard",
    //   }
    // }
});
