var chrono = require('../lib/chrono');

describe('Test suite for chrono module', function () {
  it('module should be loaded properly', function () {
    chrono.should.Object;
    chrono.init.should.Function;
    chrono.start.should.Function;
    chrono.stop.should.Function;
  });

  describe('checking options behavior', function () {

    it('when init is not called should measure the time with no decimals', function () {
      chrono.start();
      (chrono.stop() % 1 !== 0).should.be.false;
    });

    it('when decimals is not specified should measure the time with no decimals', function () {
      chrono.init();
      chrono.start();
      (chrono.stop() % 1 !== 0).should.be.false;
    });

    it('when decimals is set to false, should measure the time with no decimals', function () {
      chrono.init({ decimals: false });
      chrono.start();
      (chrono.stop() % 1 !== 0).should.be.false;
    });


    it('when decimals is set to true, should measure the time with decimals', function () {
      chrono.init({ decimals: true });
      chrono.start();
      (chrono.stop() % 1 !== 0).should.be.true;
    });

  });

  describe('checking chronometer behavior', function () {
    it('when start is not called previously stop should return 0', function () {
      chrono.stop().should.be.equal(0);
    });

    it('when start is called twice, should only consider last call to measure the time', function () {
      chrono.init({ decimals: false });
      chrono.start();
      setTimeout(function () {
        chrono.start();
        chrono.stop().should.lessThan(1);
      }, 1);
    });

    it('when stop is called twice, the second one should return 0', function () {
      chrono.init({ decimals: true });
      chrono.start();
      chrono.stop().should.greaterThan(0);
      chrono.stop().should.be.equal(0);
    });

  });
});
