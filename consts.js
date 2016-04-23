'use strict';

var massive = require("massive");

var db = require('./database.json');

module.exports = Object.freeze({
    SECRET: 'tradeogsha-secret',
    API_VERSION_ANDROID: '1.0.0',
    API_VERSION_IOS:     '1.0.0',
    DB: massive.connectSync(
      {connectionString: process.env.TLOG_DB_CONNECTION
        ||
        "postgres://root:root@localhost/tlog_test"}),
    SEND_GRID_API_USER: process.env.TLOG_SEND_GRID_API_USER || "tlog",
    SEND_GRID_API_PASSWORD: process.env.TLOG_SEND_GRID_API_PASSWORD || "echoKuku90",
    TL_HOST: process.env.TLOG_TL_HOST || "http://tlog.us:3000"
});
