'use strict';

var logger = require('./logger');

module.exports.check = function check(options) {
  options = options || {};
  options.cluster = options.cluster || false;
  options.header = options.header || false;
  options.decimals = options.decimals || false;
  options.port = options.port || 0;

  if (!options.cluster && !options.port) {
    throw new TypeError('Port number is mandatory when cluster option is disabled.');
  }

  var statsd = options.statsd;
  if (statsd) {
    if(!(statsd.host && statsd.port && statsd.prefix && statsd.routes)) {
      throw new Error('Missing statsd configuration');
    }

    if(Object.keys(statsd.routes).length === 0) {
      logger.warning('Missing statsd routes');
    }

    // TODO - Transform rule to internal representation
  }

  return options;
};
