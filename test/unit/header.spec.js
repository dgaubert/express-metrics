var header = require('../../lib/header');

describe('Header', function () {
  it('module should be loaded properly', function () {
    header.should.Object;
    header.init.should.Function;
    header.setResponseTime.should.Function;
  });

  describe('checking options behavior', function () {

    it('when init is not called should do nothing', function () {
      var res = {};
      header.setResponseTime(res, 0);
    });

    it('when header is not specified should do nothing', function () {
      var res = {};
      header.init();
      header.setResponseTime(res, 0);
    });

    it('when header is set to false, should do nothing', function () {
      var res = {};
      header.init({ header: false });
      header.setResponseTime(res, 0);
    });

    it('when header is set to true, should do set X-Response-Time header', function () {
      var res = {};
      header.init({ decimals: true });
      header.setResponseTime(res, 0);
      res.writeHead.should.Function;
    });

  });
});
