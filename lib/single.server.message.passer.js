'use strict';

function SingleServerMessagePasser(metricsServer) {
  this.metricsServer = metricsServer;
}

SingleServerMessagePasser.prototype.forwardMessage = function forwardMessage(message) {
  this.metricsServer.update(message);
};

module.exports = SingleServerMessagePasser;
