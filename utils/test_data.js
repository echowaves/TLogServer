'use strict';

var uuid = require('uuid');
var moment = require('moment');

var User       = require('../models/user'),
    Employee   = require('../models/employee'),
    ActionCode = require('../models/action_code'),
    Checkin    = require('../models/checkin');

var names = require('names');

//find all action codes

var actionCodes = new ActionCode().loadAll();

//create few users
for (var i = 0; i < 10; i++) {
  var randomName = names();
  var userEmail = randomName.replace(/\s+/g, '-').toLowerCase() + "@example.com";
  var user = new User({email: userEmail, password: 'password'});
  user.save();

  // http://localhost:3000/public/mobile_employee.html?activation_code=f880edc5-de0c-4d6e-940c-0a71b644ad36

  // console.log("User: " + user.id);

  //for each user generate employees
  for (var j = 0; j < 200; j++) {
    var randomEmployeeName = names();
    // console.log(randomName);
    var employeeEmail = randomEmployeeName.replace(/\s+/g, '-').toLowerCase() + "@example.com";
    const activation_code = uuid.v4();
    var employee =
      new Employee(
        { user_id: user.id,
          name: randomEmployeeName,
          email: employeeEmail,
          activation_code: activation_code
        });
    employee.save();
    console.log("Employee: " + employee.id);


    //skip 20% of the users
    if( j % 5 != 0) {
      //create checkins
      for (var k = 0; k < 500; k++) {
        var actionCode = actionCodes[Math.floor(Math.random() * (actionCodes.length))];
        // console.log("ActionCode: " + actionCode.id);

        var date = moment().subtract(getRandomArbitrary(400 * 1440, 0), 'minutes');
        var checkin = new Checkin(
          {
            email: employee.email,
            user_id: employee.user_id,
            checked_in_at: date,
            duration: Math.floor(Math.random() * (8 * 60 * 60)),
            action_code_id: actionCode.id
          }
        );
        checkin.save();
      }
    }
  }
}


function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
