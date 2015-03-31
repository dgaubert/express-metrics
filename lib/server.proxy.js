'use strict';

function ServerProxy(server) {
  this.server = server;
}

ServerProxy.prototype.forwardMessage = function forwardMessage(message) {
  this.server.update(message);
};

module.exports = ServerProxy;
