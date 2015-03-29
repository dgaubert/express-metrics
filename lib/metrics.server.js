var Metrics = require('metrics');

var CATEGORIES = {
  all: 'global.all',
  static: 'global.static', // i.e. "/favicon.ico"
  status: 'status',
  method: 'method'
};

function MetricsServer(port) {
  this.server = new Metrics.Server(port);
}

MetricsServer.prototype.getMetricName = function getMetricName(route, methodName) {
  var routeName = CATEGORIES.static;

  if (route && route.path) {
    routeName = route.path;

    if (Object.prototype.toString.call(routeName) === '[object RegExp]') {
      routeName = routeName.source;
    }

    routeName = routeName + '.' + methodName.toLowerCase();
  }

  return routeName;
};

MetricsServer.prototype.update = function update(message) {
  var metricName = this.getMetricName(message.route, message.method);

  this.updateMetric(CATEGORIES.all, message.time);
  this.updateMetric(CATEGORIES.status + '.' + message.status, message.time);
  this.updateMetric(CATEGORIES.method + '.' + message.method, message.time);
  this.updateMetric(metricName, message.time);
};

MetricsServer.prototype.updateMetric = function updateMetric(name, time) {
  if (!this.server.report.getMetric(name)) {
    this.server.addMetric(name, new Metrics.Timer());
  }

  this.server.report.getMetric(name).update(time);
};

module.exports = MetricsServer;
