'use strict';

module.exports.check = function check(options) {
  options = options || {};
  options.cluster = options.cluster || false;
  options.header = options.header || false;
  options.decimals = options.decimals || false;
  options.port = options.port || 0;

  if (!options.cluster && !options.port) {
    throw new TypeError('Port number is mandatory when cluster option is disabled.');
  }

  return options;
};
