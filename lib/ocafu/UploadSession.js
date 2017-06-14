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
exports.getBatchSigStr = exports.logBatchUploadEnd = exports.logBatchUploadStart = exports.createUploadSessionTag = undefined;

var _Logger = require('./Logger');

var fs = require('fs');
var path = require('path');

var createUploadSessionTag = exports.createUploadSessionTag = function createUploadSessionTag(configs) {
  return configs.uploadTag ? configs.uploadTag : buildUploadTagWithPrefix(configs.uploadTagPrefix, configs.inputFilePath);
};

var logBatchUploadStart = exports.logBatchUploadStart = function logBatchUploadStart(sessionId, batchSig) {
  _logLocal(sessionId, batchSig, 'upload_start');
};

var logBatchUploadEnd = exports.logBatchUploadEnd = function logBatchUploadEnd(sessionId, batchSig) {
  _logLocal(sessionId, batchSig, 'upload_end');
};

var getBatchSigStr = exports.getBatchSigStr = function getBatchSigStr(batchSig) {
  return batchSig.offset + 1 + ' - ' + (batchSig.offset + batchSig.size);
};

var buildUploadTagWithPrefix = function buildUploadTagWithPrefix(uploadTagPrefix, filePath) {
  return uploadTagPrefix + ' (' + getFileSignature(filePath) + ')';
};

var getFileSignature = function getFileSignature(filepath) {
  var filestat = fs.statSync(filepath);
  return path.basename(filepath) + '@' + Date.parse(filestat.mtime.toUTCString());
};

var _logLocal = function _logLocal(sessionId, batchSig, eventType) {
  (0, _Logger.getLogger)().debug('Batch ' + eventType + ': ' + getBatchSigStr(batchSig));
};