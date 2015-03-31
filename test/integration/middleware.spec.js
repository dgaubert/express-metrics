var Q = require('q');
var Quest = require('../util/quest');
var appLauncher = require('../util/app.launcher.js');
var arrayGenerator = require('../util/array.generator.js');

describe('Middleware in single thread mode', function () {

  before(function (done) {
    appLauncher.start(function () {
      done();
    });
  });

  describe('when makes a request nine times to root path', function () {

    before(function (done) {
      Q.all(arrayGenerator.generate(9).map(function (/* index */) {
          return Quest.get({ url: 'http://localhost:3000/', json: true });
        }))
        .then(function () {
          done();
        })
        .fail(function (err) {
          done(err);
        });
    });

    it('server should report metrics with count rate equal to 9', function (done) {
      Quest.get({ url: 'http://localhost:3001/metrics', json: true })
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
