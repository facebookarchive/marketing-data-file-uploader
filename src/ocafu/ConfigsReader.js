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

import { CONFIG_OPTIONS } from './ConfigOptions';
import { ERROR_CANNOT_PARSE_CONFIG_FILE } from './ErrorTypes';

const fs = require('fs');

import type { UserSuppliedConfigs } from './ConfigTypes';

const program = require('commander');
const yaml = require('js-yaml');

export const readConfigsFromFile = (
  configFilePath: string
): UserSuppliedConfigs => {
  try {
    return filterOptions(yaml.safeLoad(fs.readFileSync(configFilePath, 'utf8')));
  } catch (err) {
    throw new Error(`${ERROR_CANNOT_PARSE_CONFIG_FILE}: ${err.message}`);
  }
};

export const readConfigsFromCommandLineArgs = (
  commandLineArgs: Array<string> = process.argv,
): UserSuppliedConfigs => {
  CONFIG_OPTIONS.reduce((program: program.Command, configOption) => {
    if (!configOption.fileOnly) {
      if (configOption.noValue) {
        program.option(`--${configOption.field}`,
          configOption.description);
      } else {
        program.option(`--${configOption.field} [value]`,
          configOption.description);
      }
    }
    return program;
  }, program.allowUnknownOption()).parse(commandLineArgs);
  return filterOptions(program);
};

// Only take known option types
const filterOptions = (
  parsedOptions: Object,
): UserSuppliedConfigs => {
  return CONFIG_OPTIONS.reduce((configs, configOption) => {
    if (parsedOptions[configOption.field] !== undefined) {
      configs[configOption.field] = parsedOptions[configOption.field];
    }
    return configs;
  }, {});
};
