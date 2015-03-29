'use strict';

function SingleClientMessagePasser(singleServerMessagePasser) {
  this.singleServerMessagePasser = singleServerMessagePasser;
}

SingleClientMessagePasser.prototype.forwardMessage = function forwardMessage(message) {
  this.singleServerMessagePasser.forwardMessage(message);
};

module.exports = SingleClientMessagePasser;
