'use strict';

var Metrics = require('metrics');

function MetricsServer(port) {
  this.metricsServer = new Metrics.Server(port);
}

MetricsServer.prototype = {
  createMetric: function (msg) {
    msg.type = msg.type[0].toUpperCase() + msg.type.substring(1);
    this.metricsServer.addMetric(msg.eventType, new Metrics[msg.type]());
  },
  updateMetric: function (msg) {
    var namespaces = msg.eventType.split('.');
    var event = namespaces.pop();
    var namespace = namespaces.join('.');
    var metric = this.metricsServer.trackedMetrics[namespace][event];

    metric[msg.metricMethod].apply(metric, msg.metricArgs);
  }

  
};

module.exports = MetricsServer;
