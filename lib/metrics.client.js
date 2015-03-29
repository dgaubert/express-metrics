'use strict';

function MetricsClient(messagePasser) {
  this.messagePasser = messagePasser;
}

MetricsClient.prototype.send = function send(message) {
  message.method = message.method.toLowerCase();
  this.messagePasser.forwardMessage(message);
};

module.exports = MetricsClient;
