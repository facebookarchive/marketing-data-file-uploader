'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
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

var normalizeSignal = require('../SignalsSchema/normalizeSignal');

var CSV = require('csv-string');

var Normalizers = require('../SignalsSchema/SignalsBaseTypeNormalizers');
var Schema = require('../SignalsSchema/signalsEventDataSchema');
var SignalsUploaderUtils = require('../SignalsSchema/SignalsUploaderUtils');
var processPIISignalBeforeUpload = require('../SignalsSchema/processPIISignalBeforeUpload');

var Transformers = { processPIISignalBeforeUpload: processPIISignalBeforeUpload };
var arrayToObject = SignalsUploaderUtils.arrayToObject;
var parseAndNormalizeFeedLine = exports.parseAndNormalizeFeedLine = function parseAndNormalizeFeedLine(line, configs) {
  return normalizeSignal(arrayToObject(parseLine(line, configs.fileDelimiter)), Schema, Normalizers, Transformers, configs.colMappingInfo.mapping, configs.colMappingInfo.infoForNormalization, configs.colMappingInfo.customTypeInfo);
};

var parseLine = function parseLine(line, delimiter) {
  return CSV.parse(line, delimiter)[0];
};