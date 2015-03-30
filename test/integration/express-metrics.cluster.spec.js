var Q = require('q');
var Quest = require('../util/quest');
var clusterLauncher = require('../util/app.cluster.launcher.js');

describe('Middleware in cluster mode', function () {
  before(function (done) {
    clusterLauncher.start(function () {
      done();
    });
  });

  describe('when makes a request to root path at first time', function () {

    before(function (done) {
      Q.all([
          Quest.get({ url: 'http://localhost:4000/', json: true }),
          Quest.get({ url: 'http://localhost:4000/', json: true }),
          Quest.get({ url: 'http://localhost:4000/', json: true })
        ])
        .then(function (/*result*/) {
          done();
        })
        .fail(function (err) {
          done(err);
        });
    });

    it('.summary should return an object with default metrics', function (done) {
      Quest.get({ url: 'http://localhost:4001/metrics', json: true })
        .then(function (result) {
          result.global.all.rate.count.should.be.equal(3);
          done();
        })
        .fail(function (err) {
          done(err);
        });
    });

  });

});
