var kluster = require('./lib/kluster');
var chrono = require('./lib/chrono');
var metrics = require('./lib/metrics');
var header = require('./lib/header');

function expressMetrics(options) {
  options = (typeof options === 'undefined') ? {} : options;
  chrono.init({
    decimals: options.decimals
  });
  header.init({
    header: options.header
  });

  return function (req, res, next) {
    chrono.start();

    // decorate response#end method from express
    var end = res.end;
    res.end = function () {
      var responseTime = chrono.stop();

      header.setResponseTime(res, responseTime);

      // call to original express#res.end()
      end.apply(res, arguments);

      if (kluster.isEnabled()) {
        kluster.send(req.route, req.method, res.statusCode, responseTime);
      }

      metrics.update(req.route, req.method, res.statusCode, responseTime);
    };

    next();
  };
}

function getSummary() {
  return metrics.summary();
}

function jsonSummary(req, res) {
  console.log('responding', process.pid);
  res.json(getSummary());
}

module.exports = expressMetrics;
module.exports.getSummary = getSummary;
module.exports.jsonSummary = jsonSummary;
module.exports.initClusterMode = kluster.initCluster;
