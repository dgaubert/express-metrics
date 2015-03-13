var cluster = require('cluster');
var express = require('express');
var metrics = require('../index');

module.exports = function (callback) {
  var workersCount = 0;
  var maxWorkersCount = 2;
  var app;

  function msgReceived(msg) {
    if (msg === 'Worker up!') {
      workersCount += 1;
      if (workersCount === maxWorkersCount) {
        callback();
      }
    }
  }

  if (cluster.isMaster) {
    for (var i = 0; i < maxWorkersCount; i += 1) {
      var worker = cluster.fork();

      worker.on('message', msgReceived);
    }

    metrics.initClusterMode();

  } else {

    app = express();

    app.use(metrics());

    app.get('/', function (req, res) {
      res.json({ worker: process.pid });
    });

    app.get('/metrics', function (req, res) {
      var summary = metrics.getSummary();
      res.json({ metrics: summary, worker: process.pid });
    });

    app.listen(3000);

    process.send('Worker up!');
  }

};
