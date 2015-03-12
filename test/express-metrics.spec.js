var request = require('supertest');
var express = require('express');
var metrics = require('../index');

describe('Test suit for express-metrics middleware', function () {
  var app = express();

  app.use(metrics());

  app.get('/', function (req, res) {
    res.json({});
  });
  
  describe('when makes a request to root path at first time', function () {

    before(function (done) {
      request(app).get('/')
        .end(function (err) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('.summary should return an object with default metrics', function () {
      var summary = metrics.getSummary();

      summary.should.Object;
      summary.should.have.property('global');
      summary.global.should.have.property('all');
      summary.should.have.property('/');
      summary.should.have.property('method');
      summary.method.should.have.property('get');
      summary.should.have.property('status');
      summary.status.should.have.property('200');
    });

  });

});
