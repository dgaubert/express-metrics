var Client = require('./client');
var Server = require('./server');
var ClientProxy = require('./client.proxy');
var ServerProxy = require('./server.proxy');
var ClientClusterProxy = require('./client.cluster.proxy');
var ServerClusterProxy = require('./server.cluster.proxy');

var server;
var serverProxy;
var clientProxy;
var client;

function initServer(port, isCluster) {
  server = new Server(port);

  serverProxy = isCluster ?
    new ServerClusterProxy(server) :
    new ServerProxy(server);

  return server.server;
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
    initServer(options.port, false);
  }

  return initClient(options.cluster);
};

module.exports.startServer = function startServer(port) {
  return initServer(port, true);
};

module.exports.getServer = function getServer() {
  return server;
};

module.exports.getClient = function getClient() {
  return client;
};
