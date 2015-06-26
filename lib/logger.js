'use strict';

/*
var winston = require('winston');
var loggerConfig = require('config').logger;
var logger;

winston.emitErrs = false;
winston.loggers.add(loggerConfig.name, loggerConfig.transports);

console.log('name', loggerConfig.name);

logger = winston.loggers.get(loggerConfig.name);
*/

var logger  = require('log4js').getLogger('express-metrics');

module.exports = logger;
