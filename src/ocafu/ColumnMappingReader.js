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
const fs = require('fs');

import type { ColumnMappingInfo } from './ConfigTypes';

export const readColMappingFromFile = (
  filePath: string,
): {
  colMappingInfo: ColumnMappingInfo,
  fileDelimiter: string,
  fileHasHeader: ?boolean,
  err: ?Error,
} => {
  try {
    return parseMappingInfo(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    return {
      colMappingInfo: {
        mapping: {},
      },
      fileDelimiter: ',',
      fileHasHeader: null,
      err: err,
    };
  }
};

export const parseMappingInfo = (
  mappingInfoStr: string,
): {
  colMappingInfo: ColumnMappingInfo,
  fileDelimiter: string,
  fileHasHeader: ?boolean,
  err: ?Error,
} => {
  const mappingInfo = JSON.parse(mappingInfoStr);
  const {mapping, infoForNormalization, customTypeInfo} = mappingInfo;
  return {
    colMappingInfo: {
      mapping: mapping,
      infoForNormalization: infoForNormalization,
      customTypeInfo: customTypeInfo,
    },
    fileDelimiter: mappingInfo.delimiter,
    fileHasHeader: mappingInfo.header,
    err: null,
  };
};
