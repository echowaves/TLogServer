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
    TL_TEST_MODE: process.env.TL_TEST_MODE || false
});
