var metrics = require('../lib/metrics');

describe('Test suite for metrics module', function () {
  it('module should be loaded properly', function () {
    metrics.should.Object;
    metrics.update.should.Function;
    metrics.summary.should.Function;
  });

  it('.summary should return a metrics report', function () {
    metrics.summary().should.Object;
  });

});
