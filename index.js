var Metrics = require('metrics');
var report = new Metrics.Report();

function metrics() {
  var CATEGORIES = {
    all: 'all',
    static: 'static', // i.e. "/favicon.ico"
    status: 'status' // i.e. "status_200"
  };

  function updateMetric(name, time) {
    if (!report.getMetric(name)) {
      report.addMetric(name, new Metrics.Timer());
    }

    report.getMetric(name).update(time);
  }

  function getMetricName(route, methodName) {
    var routeName = CATEGORIES.static;

    if (route && route.path) {
      routeName = route.path;

      if (Object.prototype.toString.call(routeName) === '[object RegExp]') {
        routeName = routeName.source;
      }

      routeName = methodName + '_' + routeName;
    }

    return routeName;
  }

  return function (req, res, next) {
    var startTime = new Date();

    // decorate response#end method from express
    var end = res.end;
    res.end = function () {

      // call to original express#res.end()
      end.apply(res, arguments);

      var metricName = getMetricName(req.route, req.method);
      var responseTime = new Date() - startTime;

      updateMetric(CATEGORIES.all, responseTime);
      updateMetric(CATEGORIES.status + '_' + res.statusCode, responseTime);
      updateMetric(metricName, responseTime);
    };

    next();
  };
}

function getSummary() {
  // avoid wrapped object
  return report.summary()[''];
}

function jsonSummary(req, res) {
  res.json(getSummary());
}

module.exports = metrics;
module.exports.getSummary = getSummary;
module.exports.jsonSummary = jsonSummary;
