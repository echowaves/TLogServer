'use strict'

module.exports = Object.freeze({
    SECRET: 'tradeogsha-secret',
    DB_CONNECTION: process.env.DB_CONNECTION || "postgres://root:root@localhost/tlog_dev"
});
