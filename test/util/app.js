var express = require('express');
var expressMetrics = require('../../');

var app = express();

app.use(expressMetrics({
  cluster: true
}));

app.get('/', function (req, res) {
  res.json({ worker: process.pid });
});

process.send('Worker up!');

module.exports = app.listen(4000);
