var Server = require('../../lib/server');
var optionsChecker = require('../../lib/options.checker');
var builder = require('../../lib/builder');

var StatsD = require('node-statsd').StatsD;
var sinon = require('sinon');


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

  describe('Routes Management', function () {
    var server;

    after(function(){
      if(server) {
        // Ugly, but when the metrics server is instantiated it already starts
        server.stop();
      }
    });

    it('Stats options are properly converted to routes definition', function () {
      var expectedRoutes = {
        '/campaigns/:userId/lite': {'name': 'showUserCampaigns', 'methods': ['get']},
        '/campaign/:campaignId': {'name': 'showCampaign', 'methods': ['get']},
        '/shop/:userId': {'name': 'showUserShops', 'methods': ['get']}
      };

      server = builder.startServer(1234, {
        prefix: 'foo',
        host: 'localhost',
        port: 8195,
        routes: {
          showUserCampaigns: {
            path: '/campaigns/:userId/lite',
            methods: ['get']
          },
          showCampaign: {
            path: '/campaign/:campaignId',
            methods: ['get']
          },
          showUserShops: {
            path: '/shop/:userId',
            methods: ['get']
          }
        }
      });

      server.statsdRoutes.should.eql(expectedRoutes);

    });
  });

  describe('Server integration', function () {
    var server;
    var statsd = true;
    var routes = {
      '/campaigns/:userId/lite': {'name': 'showUserCampaigns', 'methods': ['get']},
      '/campaign/:campaignId': {'name': 'showCampaign', 'methods': ['get']},
      '/shop/:userId': {'name': 'showUserShops', 'methods': ['get']}
    };

    beforeEach(function() {
      server = new Server(1234, statsd, routes);
    });

    afterEach(function(){
      if(server) {
        // Ugly, but when the metrics server is instantiated it already starts
        server.stop();
        server = null;
      }
    });

    it('No stat is generated', function () {
      var mock = sinon.mock(server);
      mock.expects('sendToStatsD').never();

      server.update({
        route: { path: '/shop/:userId'},
        method: 'post'
      });

      mock.verify();
    });

    it('Stat is generated', function () {
      var mock = sinon.mock(server);
      mock.expects('sendToStatsD').once();

      server.update({
        route: { path: '/shop/:userId'},
        method: 'get'
      });

      mock.verify();
    });
  });


});