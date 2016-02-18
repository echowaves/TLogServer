'use strict';

var SECRET = require('../consts').SECRET;


module.exports = {
  decryptJwtFromRequest: function(request) {
    var token = request.header.authorization.replace("Bearer ", "");
    return jwt.verify(token, SECRET);
  },
};
