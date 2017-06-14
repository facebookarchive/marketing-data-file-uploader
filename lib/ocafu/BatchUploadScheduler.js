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
exports.scheduleBatchUpload = exports.buildUploadsQueue = undefined;

var _EventsUploader = require('./EventsUploader');

var async = require('async');

var buildUploadsQueue = exports.buildUploadsQueue = function buildUploadsQueue(configs) {
  return async.priorityQueue(uploadBatch);
};

var scheduleBatchUpload = exports.scheduleBatchUpload = function scheduleBatchUpload(jobQueue, normalizedEventsBatch, postData, numEvents, uploadSessionTag, configs) {
  if (normalizedEventsBatch.length > 0) {
    jobQueue.push({
      normalizedEventsBatch: normalizedEventsBatch,
      postData: postData,
      uploadSessionTag: uploadSessionTag,
      numEvents: numEvents,
      configs: configs
    }, uploadSessionTag, _EventsUploader.batchUploadCallback);
  }
};

var uploadBatch = function uploadBatch(data, callback) {
  (0, _EventsUploader.uploadEventsBatch)(data.normalizedEventsBatch, data.postData, data.uploadSessionTag, _getBatchOffset(data.numEvents, data.normalizedEventsBatch.length), data.configs, callback);
};

var _getBatchOffset = function _getBatchOffset(numEvents, curBatchSize) {
  return numEvents - curBatchSize;
};