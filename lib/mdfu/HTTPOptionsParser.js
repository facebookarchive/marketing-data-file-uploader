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
exports.buildHttpsOptions = exports.parseHttpOptions = undefined;

var _HTTPSOptions = require('./HTTPSOptions');

var commander = require('commander');

var parseHttpOptions = exports.parseHttpOptions = function parseHttpOptions(program) {
  return (0, _HTTPSOptions.getAvailableHTTPSOptions)().reduce(function (program, option) {
    program.option('--https-' + option + ' [value]', 'https option: ' + option);
    return program;
  }, program.allowUnknownOption());
};

var buildHttpsOptions = exports.buildHttpsOptions = function buildHttpsOptions(parsedOptions) {
  return Object.keys(parsedOptions).reduce(function (httpsOptions, option) {
    if (option.replace(/^https/, '') !== option) {
      var httpOptionName = option.replace(/^https/, '').replace(/^[a-z]/i, function (firstChar) {
        return firstChar.toLowerCase();
      });

      if (httpOptionName === 'rejectUnauthorized') {
        httpsOptions[httpOptionName] = parsedOptions[option] === 'true';
      } else {
        httpsOptions[httpOptionName] = parsedOptions[option];
      };
    }
    return httpsOptions;
  }, {});
};