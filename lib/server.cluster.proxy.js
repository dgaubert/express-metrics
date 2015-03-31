'use strict';

var cluster = require('cluster');

function ServerClusterProxy(server) {
  this.server = server;
  this.init();
}

ServerClusterProxy.prototype.init = function init() {

  function isFromExpressMetrics(msg) {
    return (msg.cmd && msg.cmd === 'express-metrics');
  }

  if (cluster.isMaster) {
    var _this = this;
    var workers = cluster.workers;
    Object.keys(workers).forEach(function (id) {
      workers[id].on('message', function (message) {
        if (isFromExpressMetrics(message)) {
          _this.server.update(message);
        }
      });
    });
  }
};

module.exports = ServerClusterProxy;
