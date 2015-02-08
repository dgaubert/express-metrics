var Metrics = require('metrics');
var report = new Metrics.Report();

function summary(req, res, next) {
  // hack for report summary, wraps object over another one!!!
  res.json(report.summary()['']);
}

function metrics(app, prefix) {
  var CATEGORIES = {
    requests: 'requests',
    static: 'static_path',
    status: 'request_status_'
  };

  if (typeof app === "function") {
    app.get('/metrics', summary);
  }

  if (!prefix && typeof app === "string") {
    prefix = app;
  }

  if (typeof prefix === "string") {
    Object.keys().forEach(function (key) {
      CATEGORIES[key] = prefix + '_' + CATEGORIES[key];
    });
  }

  report.addMetric(CATEGORIES.requests, new Metrics.Timer());

  return function (req, res, next) {
    var startTime = new Date();

    // decorate response#end method from express
    var end = res.end;
    res.end = function () {
      var routeName = CATEGORIES.static;
      var responseTime;

      // call to original express#res.end()
      end.apply(res, arguments);

      // non static paths (e. /favicon.ico)
      if (req.route && req.route.path) {
        routeName = req.route.path;

        if (Object.prototype.toString.call(routeName) === '[object RegExp]') {
          routeName = routeName.source;
        }

        routeName = req.method + '_' + routeName;
      }

      if (!report.getMetric(routeName)) {
        report.addMetric(routeName, new Metrics.Timer());
      }

      if (!report.getMetric(CATEGORIES.status + res.statusCode)) {
        report.addMetric(CATEGORIES.status + res.statusCode, new Metrics.Timer());
      }

      responseTime = new Date() - startTime;

      report.getMetric(CATEGORIES.requests).update(responseTime);
      report.getMetric(CATEGORIES.status + res.statusCode).update(responseTime);
      report.getMetric(routeName).update(responseTime);
    };

    next();
  };
}

module.exports = metrics;
module.exports.summary = summary;
