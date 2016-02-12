'use strict';

var massive = require("massive");

module.exports = Object.freeze({
    SECRET: 'tradeogsha-secret',
    DB: massive.connectSync({connectionString: process.env.DB_CONNECTION || "postgres://root:root@localhost/tlog_dev"})
});
