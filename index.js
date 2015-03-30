'use strict';

var MetricsClient = require('./lib/metrics.client');
var MetricsServer = require('./lib/metrics.server');
var SingleClientMessagePasser = require('./lib/single.client.message.passer');
var SingleServerMessagePasser = require('./lib/single.server.message.passer');
var ClusterClientMessagePasser = require('./lib/cluster.client.message.passer');
var ClusterServerMessagePasser = require('./lib/cluster.server.message.passer');
var header = require('./lib/header');
var chrono = require('./lib/chrono');

var metricsServer;
var messagePasserServer;
var messagePasserClient;
var metricsClient;

module.exports = function expressMetrics(options) {

  metricsServer = null;
  messagePasserServer = null;
  messagePasserClient = null;
  metricsClient = null;

  options = options || {};
  options.cluster = options.cluster || false;
  options.header = options.header || false;
  options.decimals = options.decimals || false;

  if (!options.cluster && !options.port) {
    throw new TypeError('Mandatory option port when cluster is disabled.');
  }

  if (!options.cluster && options.port) {
    initServer(options.port, false);
  }

  initClient(options.cluster);

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

module.exports.listen = function listen(port) {
  return initServer(port, true);
};

module.exports.close = function close(callback) {
  metricsServer.stop(callback);
};

function initServer(port, isCluster) {
  metricsServer = new MetricsServer(port);

  if (isCluster) {
    messagePasserServer = new ClusterServerMessagePasser(metricsServer);
  } else {
    messagePasserServer = new SingleServerMessagePasser(metricsServer);
  }

  return metricsServer.server;
}

function initClient(isCluster) {
  if (isCluster) {
    messagePasserClient = new ClusterClientMessagePasser();
  } else {
    messagePasserClient = new SingleClientMessagePasser(messagePasserServer);
  }

  metricsClient = new MetricsClient(messagePasserClient);
}
