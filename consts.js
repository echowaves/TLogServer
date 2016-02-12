'use strict';

var massive = require("massive");

var db = require('./database.json');


module.exports = Object.freeze({
    SECRET: 'tradeogsha-secret',
    DB: massive.connectSync(
      {connectionString: process.env.DB_CONNECTION
        ||
        "postgres://root:root@localhost/tlog_test"})
});
