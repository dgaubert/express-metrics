'use strict';

var onHeaders = require('on-headers');

var header = false;
var addResponseTime = function () {
  return function () {};
};

var headerResponseTime = {

  init: function (options) {
    header = options && options.header || false;
    if (header) {
      addResponseTime = function (responseTime) {
        return function () {
          if (!this.getHeader('X-Response-Time')) {
            this.setHeader('X-Response-Time', responseTime + 'ms');
          }
        };
      };
    }
  },

  setResponseTime: function (res, responseTime) {
    return onHeaders(res, addResponseTime(responseTime));
  }

};

module.exports = headerResponseTime;
