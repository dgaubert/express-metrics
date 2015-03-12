var metrics = require('./metrics');
var cluster = require('cluster');
var enabled = false;

function isFromExpressMetrics(msg) {
  return (msg.cmd && msg.cmd === 'express-metrics');
}

if (cluster.isWorker) {
  process.on('message', function (msg) {
    if (isFromExpressMetrics(msg)) {
      metrics.update(msg.route, msg.method, msg.statusCode, msg.responseTime);
    }
  });
}

var kluster = {

  initCluster: function () {
    if (cluster.isMaster) {
      enabled = true;
      var workers = cluster.workers;
      Object.keys(workers).forEach(function (id) {
        workers[id].on('message', function (msg) {
          if (isFromExpressMetrics(msg)) {
            Object.keys(workers).forEach(function (id) {
              var isNotWorkerFrom = (workers[id].process.pid !== msg.pid);
              if (isNotWorkerFrom) {
                workers[id].send(msg);
              }
            });
          }
        });
      });
    }
  },

  send: function(route, method, statusCode, responseTime) {
    if (cluster.isWorker) {
      process.send({
        cmd: 'express-metrics',
        pid: process.pid,
        route: route,
        method: method,
        statusCode: statusCode,
        responseTime: responseTime
      });
    }
  },

  isEnabled: function () {
    return enabled;
  }

};

module.exports = kluster;
