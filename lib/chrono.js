'use strict';

var decimals = false;
var startAt = [];

var chrono = {

  init: function (options) {
    decimals = options && options.decimals || false;
  },

  start: function () {
    startAt = process.hrtime();
  },

  stop: function () {
    if (!startAt.length) {
      return 0;
    }

    var diff = process.hrtime(startAt);
    var nanoseconds = diff[0] * 1e9 + diff[1];

    startAt = []; // clear for further calls

    return decimals ?
      Math.round(nanoseconds / 1e3) / 1e3 : // time in ms with 3 decimals
      Math.round(nanoseconds / 1e6); // rounded time to ms
  }

};

module.exports = chrono;
