var expressMetrics = require('../../');

describe('Express Metrics', function () {
  it('module should return the express middelware', function () {
    expressMetrics.should.Function;
  });

  describe('checking options', function () {
    it('when both cluster & port are undefined should throw exception', function () {
      (function (){
        expressMetrics();
      }).should.throw();
    });

    it('when cluster is false and port is undefined should throw exception', function () {
      (function (){
        expressMetrics({ cluster: false });
      }).should.throw();
    });
  });
});
