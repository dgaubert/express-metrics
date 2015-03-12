var metrics = require('./lib/metrics');
var cluster = require('cluster');

if (cluster.isWorker) {
  process.on('message', function (msg) {
    if (msg.cmd && msg.cmd === 'express-metrics') {
      metrics.update(msg.route, msg.method, msg.statusCode, msg.responseTime);
    }
  });
}

var kluster = {
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
  initCluster: function () {
    if (cluster.isMaster) {
      var workers = cluster.workers;
      for (var id in workers) {
        workers[id].on('message', function (msg) {
          if (msg.cmd && msg.cmd === 'express-metrics') {
            workers[id].send(msg);
          }
        });
      }
    }
  }
};

module.exports = kluster;
