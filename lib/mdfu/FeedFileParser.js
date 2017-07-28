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
exports.parseAndNormalizeFeedLine = undefined;

var _FeedUploaderConstants = require('./FeedUploaderConstants');

var _ErrorTypes = require('./ErrorTypes');

var normalizeSignal = require('../SignalsSchema/normalizeSignal');

var CSV = require('csv-string');

var Normalizers = require('../SignalsSchema/SignalsBaseTypeNormalizers');
var OCSchema = require('../SignalsSchema/SignalsEventDataSchema');
var CASchema = require('../SignalsSchema/SignalsBasicPIISchema');
var SignalsUploaderUtils = require('../SignalsSchema/SignalsUploaderUtils');
var processPIISignalBeforeUpload = require('../SignalsSchema/processPIISignalBeforeUpload');

var Transformers = { processPIISignalBeforeUpload: processPIISignalBeforeUpload };
var arrayToObject = SignalsUploaderUtils.arrayToObject;
var parseAndNormalizeFeedLine = exports.parseAndNormalizeFeedLine = function parseAndNormalizeFeedLine(line, configs) {

  return normalizeSignal(arrayToObject(parseLine(line, configs.fileDelimiter)), getSignalsSchema(configs.mode), Normalizers, Transformers, configs.colMappingInfo.mapping, configs.colMappingInfo.infoForNormalization, configs.colMappingInfo.customTypeInfo);
};

var parseLine = function parseLine(line, delimiter) {
  return CSV.parse(line, delimiter)[0];
};

var getSignalsSchema = function getSignalsSchema(mode) {
  var Schema = {};
  switch (mode) {
    case _FeedUploaderConstants.MODE_OC:
      Schema = OCSchema;
      break;
    case _FeedUploaderConstants.MODE_CA:
      Schema = CASchema;
      break;
    default:
      throw new Error(_ErrorTypes.UNSUPPORTED_MODE.description);
  }
  return Schema;
};