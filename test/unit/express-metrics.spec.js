var expressMetrics = require('../../');

describe('Express Metrics', function () {
  it('module should return a middelware', function () {
    expressMetrics.should.Function;
  });

  describe('checking options', function () {
    it('when cluster is false and port is undefined should throws exception', function () {
      (function (){
        expressMetrics();
      }).should.throw();
    });
  });
});
