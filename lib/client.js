'use strict';

function Client(proxy) {
  this.proxy = proxy;
}

Client.prototype.send = function send(message) {
  message.method = message.method.toLowerCase();
  this.proxy.forwardMessage(message);
};

module.exports = Client;
