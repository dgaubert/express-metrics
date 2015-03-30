var Quest = require('../util/quest');
var appLauncher = require('../util/app.launcher.js');

describe('Middleware', function () {

  before(function (done) {
    appLauncher.start(function () {
      done();
    });
  });

  describe('when makes a request to root path at first time', function () {

    before(function (done) {
      Quest.get({ url: 'http://localhost:3000/', json: true })
        .then(function () {
          done();
        })
        .fail(function (err) {
          done(err);
        });
    });

    it('.summary should return an object with default metrics', function (done) {
      Quest.get({ url: 'http://localhost:3001/metrics', json: true })
        .then(function (result) {
          result.global.all.rate.count.should.be.equal(1);
          done();
        })
        .fail(function (err) {
          done(err);
        });
    });

  });

});
