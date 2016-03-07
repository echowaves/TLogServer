'use strict';

var Utils = function() {
}

Utils.prototype.parseQueryString = function (qstr) {
  var query = {};
  var a = qstr.substr(0).split('&');
  for (var i = 0; i < a.length; i++) {
      var b = a[i].split('=');
      query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
  }
  return query;
}

module.exports = Utils;
