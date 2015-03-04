var Metrics = require('metrics');
var report = new Metrics.Report();

function metrics(options) {
  options = (typeof options === 'undefined') ? {} : options;

  var CATEGORIES = {
    all: 'all',
    static: 'static', // i.e. "/favicon.ico"
    status: 'status' // i.e. "status_200"
  };

  function timer(start) {
    if (!start) {
      return process.hrtime();
    }

    var diff = process.hrtime(start);
    var nanoseconds = diff[0] * 1e9 + diff[1];

    return options.decimals ?
      Math.round(nanoseconds / 1e3) / 1e3 : // time in ms with 3 decimals
      Math.round(nanoseconds / 1e6); // rounded time to ms
  }

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

  function updateMetrics(req, res, responseTime) {
    var metricName = getMetricName(req.route, req.method);

    updateMetric(CATEGORIES.all, responseTime);
    updateMetric(CATEGORIES.status + '_' + res.statusCode, responseTime);
    updateMetric(metricName, responseTime);
  }

  return function (req, res, next) {
    var startAt = timer();

    // decorate response#end method from express
    var end = res.end;
    res.end = function () {
      var responseTime = timer(startAt);

      if (options.header) {
        res.setHeader('X-Response-Time', responseTime + 'ms');
      }

      // call to original express#res.end()
      end.apply(res, arguments);

      updateMetrics(req, res, responseTime);
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
