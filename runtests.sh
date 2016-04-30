export TLOG_DB_HOST=localhost
export TLOG_DB_NAME=tlog_test
export TLOG_DB_PASS=root
export TLOG_DB_USER=root
export TLOG_HOST=http://localhost:3000

# following line is required to silence email sending, a bit smelly
export TL_TEST_MODE=true

npm test
