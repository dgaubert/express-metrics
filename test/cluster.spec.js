var request = require('request');
var clusterLauncher = require('./app.cluster.launcher.js');

var request = require('request');
var Q = require('q');

var Quest = {
  get: function (options) {
    return Q.ninvoke(request, 'get', options)
      .then(function (result) {
        // response = result[0], body = result [1]
        if (result[0].statusCode !== 200) {
          return Q.reject(result[1].message);
        }
        return result[1];
      });
  }
};

before(function (done) {
  clusterLauncher(function () {
    done();
  });
});

describe('Test suit for express-metrics middleware in cluster mode', function () {

  describe('when makes a request to root path at first time', function () {

    before(function (done) {
      Q.all([
          Quest.get({ url: 'http://localhost:3000/', json: true }),
          Quest.get({ url: 'http://localhost:3000/', json: true }),
          Quest.get({ url: 'http://localhost:3000/', json: true })
        ])
        .then(function (/*result*/) {
          done();
        })
        .fail(function (err) {
          done(err);
        });
    });

    it('.summary should return an object with default metrics', function (done) {
      Quest.get({ url: 'http://localhost:3000/metrics', json: true })
        .then(function (result) {
          result.metrics.global.all.rate.count.should.be.equal(3);
          result.should.Object;
          done();
        })
        .fail(function (err) {
          done(err);
        });
    });

  });

});
