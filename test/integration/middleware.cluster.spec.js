var Q = require('q');
var Quest = require('../util/quest');
var clusterLauncher = require('../util/app.cluster.launcher.js');

describe('Middleware in cluster mode', function () {
  before(function (done) {
    clusterLauncher.start(function () {
      done();
    });
  });

  describe('when makes a request nine times to root path', function () {

    before(function (done) {
      Q.all([ 1, 2, 3, 4, 5, 6, 7, 8, 9 ].map(function (/* index */) {
          return Quest.get({ url: 'http://localhost:4000/', json: true });
        }))
        .then(function (/*result*/) {
          done();
        })
        .fail(function (err) {
          done(err);
        });
    });

    it('server should report metrics with count rate equal to 9', function (done) {
      Quest.get({ url: 'http://localhost:4001/metrics', json: true })
        .then(function (result) {
          result.global.all.rate.count.should.be.equal(9);
          done();
        })
        .fail(function (err) {
          done(err);
        });
    });

  });

});
