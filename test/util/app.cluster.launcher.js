var cluster = require('cluster');
var path = require('path');
var expressMetrics = require('../../');

module.exports.start = function (callback) {
  var workersCount = 0;
  var maxWorkersCount = 2;

  function msgReceived(msg) {
    if (msg === 'Worker up!') {
      workersCount += 1;
      if (workersCount === maxWorkersCount) {
        callback();
      }
    }
  }

  if (cluster.isMaster) {
    cluster.setupMaster({
      exec : path.join(__dirname, 'app.js'),
    });

    for (var i = 0; i < maxWorkersCount; i += 1) {
      var worker = cluster.fork();
      worker.on('message', msgReceived);
    }

    expressMetrics.listen(4001);
  }
};
