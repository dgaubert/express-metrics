var StatsD = require('node-statsd').StatsD;

var Client = require('./client');
var Server = require('./server');
var ClientProxy = require('./client.proxy');
var ServerProxy = require('./server.proxy');
var ClientClusterProxy = require('./client.cluster.proxy');
var ServerClusterProxy = require('./server.cluster.proxy');
var logger = require('./logger');

var server;
var serverProxy;
var clientProxy;
var client;

/**
 * Converts input stats estructure to the internal structure. In converts from:
 *    name: [{path: '', methods: []}]
 *
 * To:
 *    path: { methods: [], name: ''}
 *
 * It also supports the following format:
 *
 *   name: {path: '', method: ''}
 */
function generateStatsdRoutes(stats) {
  var result = {};
  Object.keys(stats).forEach(function(name) {
    var routes = stats[name];
    if (!(routes instanceof Array)) {
      routes = [routes];
    }
    routes.forEach(function(route) {
      result[route.path] = {
        name: name,
        methods: route.method ? route.method : route.methods
      };
    });


  });
  return result;
}

function initServer(port, isCluster, statsdConfig) {
  var statsd = null;
  var statsdRoutes = null;

  if (statsdConfig) {
    if (statsdConfig.instance) {
      statsd = statsdConfig.instance;
    } else {
      statsd = new StatsD(statsdConfig.host, statsdConfig.port, statsdConfig.prefix);
      statsd.socket.on('error', function (error) {
        logger.error('Error sending stats: ', error);
      });
    }

    statsdRoutes = generateStatsdRoutes(statsdConfig.routes);
  }

  server = new Server(port, statsd, statsdRoutes);

  serverProxy = isCluster ?
    new ServerClusterProxy(server) :
    new ServerProxy(server);

  return server;
}

function initClient(isCluster) {
  clientProxy = isCluster ?
    new ClientClusterProxy() :
    new ClientProxy(serverProxy);

  client = new Client(clientProxy);

  return client;
}

module.exports.init = function init(options) {
  server = null;
  serverProxy = null;
  clientProxy = null;
  client = null;


  if (!options.cluster && options.port) {
    initServer(options.port, false, options.statsd);
  }

  return initClient(options.cluster);
};

module.exports.startServer = function startServer(port, statsdConfig) {
  return initServer(port, true, statsdConfig);
};

module.exports.getServer = function getServer() {
  return server;
};

module.exports.getClient = function getClient() {
  return client;
};
