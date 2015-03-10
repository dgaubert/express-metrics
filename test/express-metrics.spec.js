var request = require('supertest');
var express = require('express');
var metrics = require('../index');

describe('Test suit for express-metrics middleware', function(){
  var app = express();

  app.use(metrics());

  app.get('/', function (req, res){
    res.json({});
  });


  before(function (done) {
    request(app).get('/')
      .end(function (err) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('should return a json with default metrics', function () {
    var summary = metrics.getSummary();

    summary.should.have.property('global');
    summary.global.should.have.property('all');
    summary.global.all.should.have.property('type');
    summary.should.have.property('/');
    summary['/'].get.should.have.property('type');
  });
  
});
