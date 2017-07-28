/**
*  Copyright (c) 2017-present, Facebook, Inc.
*  All rights reserved.
*  
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree. An additional grant
*  of patent rights can be found in the PATENTS file in the same directory.
*  
*  @generated
**/'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var winston = require('winston');

var initializeLogger = exports.initializeLogger = function initializeLogger() {
  return new winston.Logger({
    transports: [new winston.transports.Console({
      timestamp: function timestamp() {
        return new Date().toISOString();
      },
      formatter: function formatter(options) {
        return options.timestamp() + ' ' + options.level.toUpperCase() + ' ' + (options.message ? options.message : ' ') + (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
      },
      level: winston.level
    })]
  });
};

var getLogger = exports.getLogger = function getLogger() {
  if (!global.mdfuLogger) {
    global.mdfuLogger = initializeLogger();
  }
  return global.mdfuLogger;
};

var initializeLoggerAWS = exports.initializeLoggerAWS = function initializeLoggerAWS() {
  return new winston.Logger({
    transports: [new winston.transports.Console({
      timestamp: function timestamp() {
        return new Date().toISOString();
      },
      formatter: function formatter(options) {
        var returnMsg = {
          timestamp: options.timestamp,
          level: options.level.toUpperCase(),
          msg: options.message ? options.message : ' ',
          meta: options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : ''
        };
        return JSON.stringify(returnMsg);
      },
      level: winston.level
    })]
  });
};

var getLoggerAWS = exports.getLoggerAWS = function getLoggerAWS() {
  if (!global.mdfuLoggerAWS) {
    global.mdfuLoggerAWS = initializeLoggerAWS();
  }
  return global.mdfuLoggerAWS;
};