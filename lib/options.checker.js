'use strict';

function statsdCheck(options) {
  var statsd = options.statsd;
  if (statsd) {
    if(!statsd.prefix) {
      throw new Error('Missing statsd stats prefix');
    }
    if(!statsd.instance && !(statsd.host && statsd.port)) {
      throw new Error('Missing statsd creational configuration');
    }

    if(!statsd.routes || typeof(statsd.routes) !== 'object' ) {
      throw new Error('Missing statsd routes definition ');
    }

  }
}

module.exports.check = function check(options) {
  options = options || {};
  options.cluster = options.cluster || false;
  options.header = options.header || false;
  options.decimals = options.decimals || false;
  options.port = options.port || 0;

  if (!options.cluster && !options.port) {
    throw new TypeError('Port number is mandatory when cluster option is disabled.');
  }

  statsdCheck(options);


  return options;
};
