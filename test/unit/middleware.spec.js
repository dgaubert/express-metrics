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

    it('when statsd is set when when missing a parameter an exception is thrown', function () {
      (function (){
        expressMetrics({ statsd: {port: 8125} });
      }).should.throw();
    });
  });
});
