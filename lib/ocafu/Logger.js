'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

var winston = require('winston');

var initializeLogger = exports.initializeLogger = function initializeLogger() {
  return new winston.Logger({
    transports: [new winston.transports.Console({
      timestamp: function timestamp() {
        return new Date().toISOString();
      },
      formatter: function formatter(options) {
        // Return string will be passed to getLogger().
        return options.timestamp() + ' ' + options.level.toUpperCase() + ' ' + (options.message ? options.message : ' ') + (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
      },
      level: winston.level
    })]
  });
};

var getLogger = exports.getLogger = function getLogger() {
  if (!global.ocafuLogger) {
    global.ocafuLogger = initializeLogger();
  }
  return global.ocafuLogger;
};