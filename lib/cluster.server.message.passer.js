'use strict';

var cluster = require('cluster');

function ClusterServerMessagePasser(metricsServer) {
  this.metricsServer = metricsServer;
  this.init();
}

ClusterServerMessagePasser.prototype.init = function init() {

  function isFromExpressMetrics(msg) {
    return (msg.cmd && msg.cmd === 'express-metrics');
  }

  if (cluster.isMaster) {
    var _this = this;
    var workers = cluster.workers;
    Object.keys(workers).forEach(function (id) {
      workers[id].on('message', function (message) {
        if (isFromExpressMetrics(message)) {
          _this.metricsServer.update(message);
        }
      });
    });
  }
};

module.exports = ClusterServerMessagePasser;
