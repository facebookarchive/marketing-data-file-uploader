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

import type { HTTPSOptions } from './HTTPSOptions';
import { getAvailableHTTPSOptions } from './HTTPSOptions';

const commander = require('commander');

const fs = require('fs');

export const parseHttpOptions = (
  program: commander.Command,
): commander.Command => {
  return getAvailableHTTPSOptions().reduce((
    program: commander.Command,
    option,
  ): commander.Command => {
    program.option(`--https-${option} [value]`, `https option: ${option}`);
    return program;
  }, program.allowUnknownOption());
};

export const buildHttpsOptions = (
  parsedOptions: Object,
): ?HTTPSOptions => {
  return Object.keys(parsedOptions).reduce((httpsOptions, option) => {
    if (option.replace(/^https/, '') !== option) {
      const httpOptionName = option
        .replace(/^https/, '')
        .replace(/^[a-z]/i, (firstChar) => { return firstChar.toLowerCase(); });

      if (httpOptionName === 'rejectUnauthorized') {
        httpsOptions[httpOptionName] = parsedOptions[option] === 'true';
      } else if (httpOptionName.match(/^key|cert|ca|pfx$/)) {
        if (httpOptionName === 'ca') {
          httpsOptions['ca'] = parsedOptions[option].split(',').map(filename => {
            return fs.readFileSync(filename);
          });
        } else {
          httpsOptions[httpOptionName] = fs.readFileSync(parsedOptions[option]);
        }
      } else {
        httpsOptions[httpOptionName] = parsedOptions[option];
      };
    }
    return httpsOptions;
  }, {});
}
