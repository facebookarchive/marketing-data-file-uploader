/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 *
 */
 
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var fs = require('fs');

var readColMappingFromFile = exports.readColMappingFromFile = function readColMappingFromFile(filePath) {
  try {
    return parseMappingInfo(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    return {
      colMappingInfo: {
        mapping: {}
      },
      fileDelimiter: ',',
      fileHasHeader: null,
      err: err
    };
  }
};

var parseMappingInfo = exports.parseMappingInfo = function parseMappingInfo(mappingInfoStr) {
  var mappingInfo = JSON.parse(mappingInfoStr);
  var mapping = mappingInfo.mapping,
      infoForNormalization = mappingInfo.infoForNormalization,
      customTypeInfo = mappingInfo.customTypeInfo;

  return {
    colMappingInfo: {
      mapping: mapping,
      infoForNormalization: infoForNormalization,
      customTypeInfo: customTypeInfo
    },
    fileDelimiter: mappingInfo.delimiter,
    fileHasHeader: mappingInfo.header,
    err: null
  };
};
