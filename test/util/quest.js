'use strict';

var request = require('request');
var Q = require('q');

var Quest = {
  get: function (options) {
    return Q.ninvoke(request, 'get', options)
      .then(function (result) {
        // response = result[0], body = result [1]
        if (result[0].statusCode !== 200) {
          return Q.reject(result[1].message);
        }
        return result[1];
      });
  }
};

module.exports = Quest;
