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
import { SUPPORTED_MODES } from './FeedUploaderConstants';

import { parseHttpOptions, buildHttpsOptions } from './HTTPOptionsParser';

const fs = require('fs');

import type { UserSuppliedConfigs } from './ConfigTypes';

const commander = require('commander');
const yaml = require('js-yaml');

export const readConfigsFromFile = (
  configFilePath: string
): UserSuppliedConfigs => {
  try {
    return filterOptions(yaml.safeLoad(
      fs.readFileSync(configFilePath, 'utf8'),
      {schema: yaml.FAILSAFE_SCHEMA},
    ));
  } catch (err) {
    throw new Error(`${ERROR_CANNOT_PARSE_CONFIG_FILE.description}: ${err.message}`);
  }
};

export const readConfigsFromCommandLineArgs = (
  commandLineArgs: Array<string> = process.argv,
): UserSuppliedConfigs => {
  const program = new commander.Command();

  CONFIG_OPTIONS.sort((a, b): number => {
    return a.field < b.field ? -1 : (a.field > b.field ? 1 : 0);
  }).reduce((
    program: commander.Command,
    configOption,
  ): commander.Command => {
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
  }, program.allowUnknownOption());

  SUPPORTED_MODES.forEach((mode) => {
    program.command(mode).allowUnknownOption().action(function() {
      program.mode = mode;
    });
  });

  parseHttpOptions(program).parse(commandLineArgs);
  const httpsOptions = buildHttpsOptions(program);

  return {
    ...filterOptions(program),
    httpsOptions: httpsOptions,
  };
};

// Only take known option types
const filterOptions = (
  parsedOptions: Object,
): UserSuppliedConfigs => {
  const configs = CONFIG_OPTIONS.reduce((configs, configOption) => {
    if (parsedOptions[configOption.field] !== undefined) {
      configs[configOption.field] = parsedOptions[configOption.field];
      if (configOption.numeric) {
        configs[configOption.field] = Number(configs[configOption.field]);
      }
    }
    return configs;
  }, {});
  if (parsedOptions.mode) {
    configs.mode = parsedOptions.mode; // keep the mode
  }
  return configs;
};
