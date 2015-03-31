'use strict';

module.exports.generate = function generate(size) {
  var arr = [];

  for(var i = 0; i < size; i += 1) {
     arr.push(i);
  }

  return arr;
};
