/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

const winston = require('winston');

export const initializeLogger = (): winston.Logger => {
  return new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        timestamp: function() {
          return new Date().toISOString();
        },
        formatter: function(options) {
          // Return string will be passed to getLogger().
          return options.timestamp() + ' ' + options.level.toUpperCase() + ' ' +
            (options.message ? options.message : ' ') +
            (options.meta && Object.keys(options.meta).length ? '\n\t' +
              JSON.stringify(options.meta) : '' );
        },
        level: winston.level,
      })
    ]
  });
};

export const getLogger = (): winston.Logger => {
  if (!global.mdfuLogger) {
    global.mdfuLogger = initializeLogger();
  }
  return global.mdfuLogger;
};

export const initializeLoggerAWS = (): winston.Logger => {
  return new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        timestamp: function() {
          return new Date().toISOString();
        },
        formatter: function(options) {
          // Return string will be passed to getLogger().
          const returnMsg = {
            timestamp: options.timestamp,
            level: options.level.toUpperCase(),
            msg: (options.message ? options.message : ' '),
            meta: (options.meta && Object.keys(options.meta).length ? '\n\t' +
              JSON.stringify(options.meta) : '' )
          };
          return JSON.stringify(returnMsg);
        },
        level: winston.level,
      })
    ]
  });
};

export const getLoggerAWS = (): winston.Logger => {
  if (!global.mdfuLoggerAWS) {
    global.mdfuLoggerAWS = initializeLoggerAWS();
  }
  return global.mdfuLoggerAWS;
};
