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
exports.buildConfigs = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ColumnMappingReader = require('./ColumnMappingReader');

var _ConfigsReader = require('./ConfigsReader');

var _ConfigOptions = require('./ConfigOptions');

var _ErrorTypes = require('./ErrorTypes');

var _FeedUploaderConstants = require('./FeedUploaderConstants');

var _package = require('../../package.json');

var path = require('path');

var buildConfigs = exports.buildConfigs = function buildConfigs() {
  var argv = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : process.argv;

  var commandLineArgs = (0, _ConfigsReader.readConfigsFromCommandLineArgs)(argv);

  if (!commandLineArgs.mode || !_FeedUploaderConstants.SUPPORTED_MODES.includes(commandLineArgs.mode)) {
    return { err: new Error(_ErrorTypes.ERROR_NO_MODE.description) };
  }

  if (commandLineArgs.mode === _FeedUploaderConstants.MODE_VER) {
    console.log('v' + _package.version);
    return { err: null };
  }

  var defaultMappingFile = _FeedUploaderConstants.DEFAULT_COLUMN_MAPPING_FILE[commandLineArgs.mode];
  var defaultConfigFile = _FeedUploaderConstants.DEFAULT_CONFIG_FILE[commandLineArgs.mode];

  var _readColMappingFromFi = (0, _ColumnMappingReader.readColMappingFromFile)(configFileFullPath(commandLineArgs.columnMappingFilePath, defaultMappingFile)),
      colMappingInfo = _readColMappingFromFi.colMappingInfo,
      fileHasHeader = _readColMappingFromFi.fileHasHeader,
      fileDelimiter = _readColMappingFromFi.fileDelimiter,
      err = _readColMappingFromFi.err;

  if (err) {
    return { err: err };
  }

  var configs = _extends({}, _FeedUploaderConstants.DEFAULT_APP_CONFIGS, (0, _ConfigsReader.readConfigsFromFile)(configFileFullPath(commandLineArgs.configFilePath, defaultConfigFile)), {
    colMappingInfo: colMappingInfo,
    fileDelimiter: fileDelimiter,
    fileHasHeader: fileHasHeader
  }, commandLineArgs);

  if (configs.mode === _FeedUploaderConstants.MODE_CA) {
    for (var key in colMappingInfo.mapping) {
      colMappingInfo.mapping[key] = colMappingInfo.mapping[key].split('.').slice(-1)[0];
    }
  }

  var configErrors = validateConfigOptions(configs);

  if (configErrors.length > 0) {
    return {
      configs: configs,
      err: new Error(error_invalid_config_option(configErrors))
    };
  }

  return { configs: configs, err: null };
};

var configFileFullPath = function configFileFullPath(filePath, defaultPath) {
  var configFilePath = filePath || defaultPath;
  return path.isAbsolute(configFilePath) ? configFilePath : path.join(process.cwd(), configFilePath);
};

var error_invalid_config_option = function error_invalid_config_option(configErrors) {
  return 'Missing or invalid config options:\n' + configErrors.map(function (error) {
    return '\t--' + error.field + ': ' + error.message;
  }).join('\n');
};

var validateConfigOptions = function validateConfigOptions(configs) {
  return _ConfigOptions.CONFIG_OPTIONS.reduce(function (errors, configOption) {
    if (configOption.field in configs) {
      if ('validator' in configOption && !configOption.skip.includes(configs.mode) && configOption.validator instanceof Function && !configOption.validator(configs[configOption.field])) {
        errors.push({
          field: configOption.field,
          message: _ErrorTypes.ERROR_REQUIRED_CONFIG_VALUE_INVALID.description
        });
      }
    } else {
      if (!configOption.optional.includes(configs.mode)) {
        errors.push({
          field: configOption.field,
          message: _ErrorTypes.ERROR_REQUIRED_CONFIG_OPTION_MISSING.description
        });
      }
    }
    return errors;
  }, []);
};