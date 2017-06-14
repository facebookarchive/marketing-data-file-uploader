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

import { readColMappingFromFile } from './ColumnMappingReader';
import { readConfigsFromFile, readConfigsFromCommandLineArgs }
  from './ConfigsReader';
import type { FeedUploaderConfigs }
  from './ConfigTypes';

import { CONFIG_OPTIONS } from './ConfigOptions';
import {
  ERROR_REQUIRED_CONFIG_OPTION_MISSING,
  ERROR_REQUIRED_CONFIG_VALUE_INVALID,
  ERROR_NO_MODE,
} from './ErrorTypes';
import {
  DEFAULT_APP_CONFIGS,
  DEFAULT_COLUMN_MAPPING_FILE,
  DEFAULT_CONFIG_FILE,
  SUPPORTED_MODES,
  MODE_CA,
} from './FeedUploaderConstants';

import type { ConfigErrorType } from './ConfigOptions';

const path = require('path');

export const buildConfigs = (
  argv: Array<string> = process.argv,
): {configs?: FeedUploaderConfigs, err: ?Error} => {
  const commandLineArgs = readConfigsFromCommandLineArgs(argv);

  if (!commandLineArgs.mode ||
      !SUPPORTED_MODES.includes(commandLineArgs.mode)) {
    return {err: new Error(ERROR_NO_MODE)};
  }

  const {
    colMappingInfo,
    fileHasHeader,
    fileDelimiter,
    err
  } = readColMappingFromFile(
    configFileFullPath(
      commandLineArgs.columnMappingFilePath,
      DEFAULT_COLUMN_MAPPING_FILE,
    )
  );

  if (err) {
    return { err };
  }

  const configs = {
    ...DEFAULT_APP_CONFIGS,
    ...readConfigsFromFile(
      configFileFullPath(commandLineArgs.configFilePath, DEFAULT_CONFIG_FILE)
    ),
    colMappingInfo,  // Settings read from the mapping file
    fileDelimiter,
    fileHasHeader,
    ...commandLineArgs,
  };

  // for ca upload, sanitize the mapping by removing any preceding namespaces
  if (configs.mode === MODE_CA) {
    for (const key in colMappingInfo.mapping) {
      colMappingInfo.mapping[key] =
        colMappingInfo.mapping[key].split('.').slice(-1)[0];
    }
  }

  const configErrors = validateConfigOptions(configs);

  if (configErrors.length > 0) {
    return {
      configs: configs,
      err: new Error(error_invalid_config_option(configErrors))
    };
  }

  return {configs: configs, err: null};
};

const configFileFullPath = (
  filePath?: string,
  defaultPath: string,
): string => {
  const configFilePath = filePath || defaultPath;
  return path.isAbsolute(configFilePath) ? configFilePath :
    path.join(process.cwd(), configFilePath);
};

const error_invalid_config_option = (
  configErrors: Array<ConfigErrorType>,
): string => {
  return 'Missing or invalid config options:\n' +
         configErrors
          .map(error => `\t--${error.field}: ${error.message}`)
          .join('\n');
};

const validateConfigOptions = (
  configs: FeedUploaderConfigs
): Array<ConfigErrorType> => {
  return CONFIG_OPTIONS.reduce((errors, configOption) => {
    // If value exists in configs read, check if valid
    if (configOption.field in configs) {
      if ('validator' in configOption
        && configOption.validator instanceof Function
        && !configOption.validator(configs[configOption.field])) {
        errors.push({
          field: configOption.field,
          message: ERROR_REQUIRED_CONFIG_VALUE_INVALID,
        });
      }
    } else {
      if (!configOption.optional) {
        errors.push({
          field: configOption.field,
          message: ERROR_REQUIRED_CONFIG_OPTION_MISSING,
        });
      }
    }
    return errors;
  }, []);
};
