'use strict';

function ClientProxy(serverProxy) {
  this.serverProxy = serverProxy;
}

ClientProxy.prototype.forwardMessage = function forwardMessage(message) {
  this.serverProxy.forwardMessage(message);
};

module.exports = ClientProxy;
