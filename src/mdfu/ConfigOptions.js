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

import {
  FILE_DELIMITERS,
  MODE_OC,
  MODE_CA,
  MODE_VER,
} from './FeedUploaderConstants';

const winston = require('winston');

export type ConfigErrorType = {
  field: string,
  message: string,
};

type ConfigOption = {
  field: string,
  description: string,
  validator?: Function,
  optional: Array<string>,
  skip: Array<string>,
}

// - field: Name of the field or
// - validator: RegExp or string or array of values or function for validation
// - optional: Under these modes the option is optional
// - skip: Under these modes skip validation (unused option)
// - numeric: All configs are parsed as strings. Converted to number if this is set
//            Note that fbids are 64-bit and is out of the range of js integers
//            Therefore all fbids need to remain strings throughout
export const CONFIG_OPTIONS: Array<ConfigOption> = [
  {
    field: 'accessToken',
    description: 'Access token for API call',
    optional: [ MODE_VER ],
    skip: [ MODE_VER ],
  },
  {
    field: 'dataSetId',
    validator: (dataSetId: string | number) => {
      return typeof(dataSetId) === 'string' ? dataSetId.match(/^\d+$/) : true;
    },
    description: 'ID of your offline event data set',
    optional: [ MODE_VER, MODE_CA ],
    skip: [ MODE_VER, MODE_CA ],
  },
  {
    field: 'customAudienceId',
    validator: (customAudienceId: string | number) => {
      return typeof(customAudienceId) === 'string' ? customAudienceId.match(/^\d+$/) : true;
    },
    description: 'ID of your custom audience',
    optional: [ MODE_VER, MODE_OC, MODE_CA ],
    skip: [ MODE_VER, MODE_OC ],
  },
  {
    field: 'adAccountId',
    validator: (adAccountId: string | number) => {
      return typeof(adAccountId) === 'string' ? adAccountId.match(/^\d+$/) : true;
    },
    description: 'ID of the ad account for which to create new custom audience',
    optional: [ MODE_VER, MODE_OC, MODE_CA ],
    skip: [ MODE_VER, MODE_OC ],
  },
  {
    field: 'fileDelimiter',
    validator: (delim: string) => {
      return FILE_DELIMITERS.find(supportedDelim => supportedDelim === delim);
    },
    description: 'delimiter of your file. ex) comma(,) for CSV',
    optional: [ MODE_VER ],
    skip: [ MODE_VER ],
  },
  {
    field: 'uploadTag',
    description: 'Tag to identify the events uploaded ex) monthly in store uploads',
    optional: [ MODE_OC, MODE_CA, MODE_VER ],
    skip: [ MODE_VER ],
  },
  {
    field: 'uploadTagPrefix',
    description: 'If uploadTag is not provided, filename/timestamp is appended to' +
                 ' uploadTagPrefix to identify each unique upload session.',
    optional: [ MODE_OC, MODE_CA, MODE_VER ],
    skip: [ MODE_VER ],
  },
  {
    field: 'columnMappingFilePath',
    description: 'File containing column mapping info',
    optional: [ MODE_OC, MODE_CA, MODE_VER ],
    skip: [ MODE_VER ],
  },
  {
    field: 'inputFilePath',
    description: 'File containing offline conversions data',
    optional: [ MODE_VER ],
    skip: [ MODE_VER ],
  },
  {
    field: 'configFilePath',
    description: 'File containing offline conversions data',
    optional: [ MODE_OC, MODE_CA, MODE_VER ],
    skip: [ MODE_VER ],
  },
  {
    field: 'silent',
    description: 'Silently process files without interacting externally',
    optional: [ MODE_OC, MODE_CA, MODE_VER ],
    skip: [ MODE_VER ],
  },
  {
    field: 'logging',
    validator: (logging: string) => {
      return typeof(logging) === 'string' &&
        logging in winston.config.npm.levels;
    },
    description: 'Control the logging level of program',
    optional: [ MODE_OC, MODE_CA, MODE_VER ],
    skip: [ MODE_VER ],
  },
  {
    field: 'batchSize',
    description: 'Number of events included in each API request (1-2000)',
    optional: [ MODE_OC, MODE_CA, MODE_VER ],
    skip: [ MODE_VER ],
    numeric: true,
  },
  {
    field: 'testOnly',
    description: 'Run in test mode.  Check error rate on sampled data. Stop error rate is too high',
    optional: [ MODE_OC, MODE_CA, MODE_VER ],
    noValue: true,
    skip: [ MODE_VER ],
  },
  {
    field: 'aws',
    description: 'Output in JSON format for AWS process',
    optional: [ MODE_VER, MODE_CA, MODE_OC ],
    noValue: true,
    skip: [ MODE_VER, MODE_CA, MODE_OC ],
  },
];
