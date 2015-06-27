var server = require('../../lib/server');
var optionsChecker = require('../../lib/options.checker');

var StatsD = require('node-statsd').StatsD;


describe('StatsD Integration', function () {

  describe('Options Management', function () {
    it('Default instantiation when no creational options are passed', function () {
      (function () {
        optionsChecker.check({
          port: 1234,
          statsd: {
            routes: {},
            prefix: 'foo'
          }
        });
      }).should.throw();
    });

    it('Already existant instance of statsd provided', function () {
      (function (){
        optionsChecker.check({
          port: 1234,
          statsd: {
            routes: {},
            prefix: 'foo',
            instance: new StatsD()
          }
        });
      }).should.not.throw();
    });

    it('Internal instantiation', function () {
      (function (){
        optionsChecker.check({
          port: 1234,
          statsd: {
            host: 'localhost',
            port: 8195,
            prefix: 'foo',
            routes: {}
          }
        });
      }).should.not.throw();
    });

    it('No prefix provided', function () {
      (function (){
        optionsChecker.check({
          port: 1234,
          statsd: {
            routes: {},
            host: 'localhost',
            port: 8195
          }
        });
      }).should.throw();
    });

    it('No routes provided', function () {
      (function (){
        optionsChecker.check({
          port: 1234,
          statsd: {
            prefix: 'foo',
            host: 'localhost',
            port: 8195
          }
        });
      }).should.throw();
    });

  });

  // describe('Routes Management', function () {
  //   it('Stats options are properly converted to routes definition', function () {
  //   });
  // });

  // describe('Server integration', function () {
  //   it('No stat is generated', function () {
  //   });

  //   it('Stat is generated', function () {
  //   });
  // });


});