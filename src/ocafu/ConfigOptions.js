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

import { FILE_DELIMITERS, SUPPORTED_API_VERSIONS } from './FeedUploaderConstants';

const winston = require('winston');

export type ConfigErrorType = {
  field: string,
  message: string,
};

// - field: Name of the field or
// - validator: RegExp or string or array of values or function for validation
// All fields are required unless marked optional: true
export const CONFIG_OPTIONS = [
  {
    field: 'accessToken',
    description: 'Access token for API call',
  },
  {
    field: 'apiVer',
    validator: (apiVer: string) => {
      return SUPPORTED_API_VERSIONS.find(ver => ver === apiVer);
    },
    description: 'Version of FB marketing API used',
  },
  {
    field: 'dataSetId',
    validator: (dataSetId: string | number) => {
      return typeof(dataSetId) === 'string' ? dataSetId.match(/^\d+$/) : true;
    },
    description: 'ID of your offline event data set',
  },
  {
    field: 'fileDelimiter',
    validator: (delim: string) => {
      return FILE_DELIMITERS.find(supportedDelim => supportedDelim === delim);
    },
    description: 'delimiter of your file. ex) comma(,) for CSV',
  },
  {
    field: 'uploadTag',
    description: 'Tag to identify the events uploaded ex) monthly in store uploads',
    optional: true,
  },
  {
    field: 'uploadTagPrefix',
    description: 'If uploadTag is not provided, filename/timestamp is appended to' +
                 ' uploadTagPrefix to identify each unique upload session.',
    optional: true,
  },
  {
    field: 'columnMappingFilePath',
    description: 'File containing column mapping info',
    optional: true,
  },
  {
    field: 'inputFilePath',
    description: 'File containing offline conversions data',
  },
  {
    field: 'configFilePath',
    description: 'File containing offline conversions data',
    optional: true,
  },
  {
    field: 'silent',
    description: 'Silently process files without interacting externally',
    optional: true,
  },
  {
    field: 'logging',
    validator: (logging: string) => {
      return typeof(logging) === 'string' &&
        logging in winston.config.npm.levels;
    },
    description: 'Control the logging level of program',
    optional: true,
  },
  {
    field: 'batchSize',
    description: 'Number of events included in each API request (1-2000)',
    optional: true,
  },
  {
    field: 'testOnly',
    description: 'Run in test mode.  Check error rate on sampled data. Stop error rate is too high',
    optional: true,
    noValue: true,
  },
];
