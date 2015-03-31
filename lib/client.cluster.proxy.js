'use strict';

function ClientClusterProxy() {
}

ClientClusterProxy.prototype.forwardMessage = function forwardMessage(message) {
  message.cmd = 'express-metrics';
  process.send(message);
};

module.exports = ClientClusterProxy;
