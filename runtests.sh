export TLOG_DB_HOST=localhost
export TLOG_DB_NAME=tlog_test
export TLOG_DB_PASS=root
export TLOG_DB_USER=root
export TLOG_HOST=http://192.168.1.5:3000
export TLOG_S3BUCKET=tlog-coi-test

# following line is required to silence email sending, a bit smelly
export TL_TEST_MODE=true

#it.only('should be able to upload COI for employee', function*() {

npm test
