var express = require('express');
var expressMetrics = require('../../');
var app;
var server;

module.exports.start = function (callback) {
  app = express();

  app.use(expressMetrics({ port: 3001 }));

  app.get('/', function (req, res) {
    res.json({ master: process.pid });
  });

  server = app.listen(3000);

  callback();
};
