'use strict';

var cluster = require('cluster');
var MetricsClient = require('./lib/metrics.client');
var MetricsServer = require('./lib/metrics.server');
var SingleClientMessagePasser = require('./lib/single.client.message.passer');
var SingleServerMessagePasser = require('./lib/single.server.message.passer');
var ClusterClientMessagePasser = require('./lib/cluster.client.message.passer');
var ClusterServerMessagePasser = require('./lib/cluster.server.message.passer');
var header = require('./lib/header');
var chrono = require('./lib/chrono');

var metricsServer;
var messagePasser;
var metricsClient;

function isSingle() {
  return cluster.isMaster && !Object.keys(cluster.workers).length;
}

function initServer(port) {
  metricsServer = new MetricsServer(port);

  if (isSingle()) {
    messagePasser = new SingleServerMessagePasser(metricsServer);
  } else {
    messagePasser = new ClusterServerMessagePasser(metricsServer);
  }
}

function initClient() {
  if (isSingle()) {
    messagePasser = new SingleClientMessagePasser(metricsServer);
  } else {
    messagePasser = new ClusterClientMessagePasser();
  }

  metricsClient = new MetricsClient(messagePasser);
}

var serve = function serve(port) {
  initServer(port);
};

var monitor = function monitor(options) {
  options = (typeof options === 'undefined') ? {} : options;
  header.init({ header: options.header });
  chrono.init({ decimals: options.decimals });

  initClient();

  return function (req, res, next) {
    chrono.start();

    // decorate response#end method from express
    var end = res.end;
    res.end = function () {
      var responseTime = chrono.stop();

      header.setResponseTime(res, responseTime);

      // call to original express#res.end()
      end.apply(res, arguments);

      metricsClient.send({
        route: req.route,
        method: req.method,
        status: res.statusCode,
        time: responseTime
      });
    };

    next();
  };

};

module.exports = {
  serve: serve,
  monitor: monitor
};
