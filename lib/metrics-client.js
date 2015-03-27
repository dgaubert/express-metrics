'use strict';

function MetricsClient(messagePasser, eventType) {
  this.messagePasser = messagePasser;
  this.eventType = eventType;
}

MetricsClient.prototype = {
  newMetric: function (type, eventType) {
    this.messagePasser.sendMessage({
      method: 'createMetric',
      type: type,
      eventType: eventType
    });
  },
  forwardMessage: function (method, args) {
    this.messagePasser.sendMessage({
      method: 'updateMetric',
      metricMethod: method,
      metricArgs: args,
      eventType: this.eventType
    });
  },
  update: function (val) {
    return this.forwardMessage('update', [val]);
  },
  mark: function (n) {
    return this.forwardMessage('mark', [n]);
  },
  inc: function (n) {
    return this.forwardMessage('inc', [n]);
  },
  dec: function (n) {
    return this.forwardMessage('dec', [n]);
  },
  clear: function () {
    return this.forwardMessage('clear');
  }
};

module.exports = MetricsClient;
