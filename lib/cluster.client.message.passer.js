'use strict';

function ClusterClientMessagePasser(metricsServer) {
  this.metricsServer = metricsServer;
}

ClusterClientMessagePasser.prototype.forwardMessage = function forwardMessage(message) {
  message.cmd = 'express-metrics';
  process.send(message);
};

module.exports = ClusterClientMessagePasser;
