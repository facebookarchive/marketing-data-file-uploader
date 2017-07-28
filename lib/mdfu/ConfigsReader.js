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
exports.readConfigsFromCommandLineArgs = exports.readConfigsFromFile = undefined;

var _ConfigOptions = require('./ConfigOptions');

var _ErrorTypes = require('./ErrorTypes');

var _FeedUploaderConstants = require('./FeedUploaderConstants');

var fs = require('fs');

var commander = require('commander');
var yaml = require('js-yaml');

var readConfigsFromFile = exports.readConfigsFromFile = function readConfigsFromFile(configFilePath) {
  try {
    return filterOptions(yaml.safeLoad(fs.readFileSync(configFilePath, 'utf8'), { schema: yaml.FAILSAFE_SCHEMA }));
  } catch (err) {
    throw new Error(_ErrorTypes.ERROR_CANNOT_PARSE_CONFIG_FILE.description + ': ' + err.message);
  }
};

var readConfigsFromCommandLineArgs = exports.readConfigsFromCommandLineArgs = function readConfigsFromCommandLineArgs() {
  var commandLineArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : process.argv;

  var program = new commander.Command();
  _ConfigOptions.CONFIG_OPTIONS.reduce(function (program, configOption) {
    if (!configOption.fileOnly) {
      if (configOption.noValue) {
        program.option('--' + configOption.field, configOption.description);
      } else {
        program.option('--' + configOption.field + ' [value]', configOption.description);
      }
    }
    return program;
  }, program.allowUnknownOption());

  _FeedUploaderConstants.SUPPORTED_MODES.forEach(function (mode) {
    program.command(mode).allowUnknownOption().action(function () {
      program.mode = mode;
    });
  });

  program.parse(commandLineArgs);
  return filterOptions(program);
};

var filterOptions = function filterOptions(parsedOptions) {
  var configs = _ConfigOptions.CONFIG_OPTIONS.reduce(function (configs, configOption) {
    if (parsedOptions[configOption.field] !== undefined) {
      configs[configOption.field] = parsedOptions[configOption.field];
      if (configOption.numeric) {
        configs[configOption.field] = Number(configs[configOption.field]);
      }
    }
    return configs;
  }, {});
  if (parsedOptions.mode) {
    configs.mode = parsedOptions.mode;
  }
  return configs;
};