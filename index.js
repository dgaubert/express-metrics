'use strict';

var builder = require('./lib/builder');
var header = require('./lib/header');
var chrono = require('./lib/chrono');
var optionsChecker = require('./lib/options.checker');

module.exports = function expressMetrics(options) {
  var client;

  options = optionsChecker.check(options);

  builder.init(options);
  client = builder.getClient();

  header.init({ header: options.header });
  chrono.init({ decimals: options.decimals });

  return function (req, res, next) {
    chrono.start();

    // decorate response#end method from express
    var end = res.end;
    res.end = function () {
      var responseTime = chrono.stop();

      header.setResponseTime(res, responseTime);

      // call to original express#res.end()
      end.apply(res, arguments);

      client.send({
        route: req.route,
        method: req.method,
        status: res.statusCode,
        time: responseTime
      });
    };

    next();
  };

};

module.exports.listen = function listen(port) {
  if (builder.getServer()) {
    return builder.getMetricsServer();
  }

  return builder.startServer(port);
};

module.exports.close = function close(callback) {
  builder.getServer().stop(callback);
};
