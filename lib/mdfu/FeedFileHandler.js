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
exports.feedFileFullPath = exports.parseAndNormalizeFeedFile = undefined;

var _BatchUploadScheduler = require('./BatchUploadScheduler');

var _FeedFileParser = require('./FeedFileParser');

var _UploadSession = require('./UploadSession');

var _Logger = require('./Logger');

var _FeedUploaderConstants = require('./FeedUploaderConstants');

var _RequestDataBuilder = require('./RequestDataBuilder');

var path = require('path');
var waitUntil = require('wait-until');
var async = require('async');
var LineByLineReader = require('line-by-line');

var MAX_QUEUE_LENGTH = 5;
var WAIT_INTERVAL = 5000;
var WAIT_TIMES = 60;

var parseAndNormalizeFeedFile = exports.parseAndNormalizeFeedFile = function parseAndNormalizeFeedFile(configs) {
  var lr = new LineByLineReader(feedFileFullPath(configs.inputFilePath), {
    flags: 'r',
    encoding: 'utf-8'
  });
  var uploadJobQueue = (0, _BatchUploadScheduler.buildUploadsQueue)(configs);
  var uploadSessionTag = (0, _UploadSession.createUploadSessionTag)(configs);

  var numEventsTotal = 0;
  var linesRead = 0;
  var batchData = [];

  (0, _Logger.getLogger)().info('Upload tag: ' + uploadSessionTag);

  var caSchema = void 0;
  if (configs.mode === _FeedUploaderConstants.MODE_CA) {
    caSchema = (0, _RequestDataBuilder.extractCASchema)(configs.colMappingInfo.mapping);
  }

  lr.on('line', function (line) {
    lr.pause();
    linesRead += 1;
    if (linesRead === 1 && configs.fileHasHeader) {
      lr.resume();
      return;
    }
    if (line.length > 0) {
      batchData.push((0, _FeedFileParser.parseAndNormalizeFeedLine)(line, configs).normalizedValue);
      numEventsTotal += 1;
    }
    if (batchData.length % configs.batchSize === 0) {
      var curBatch = batchData;
      batchData = [];
      (0, _BatchUploadScheduler.scheduleBatchUpload)(uploadJobQueue, curBatch, (0, _RequestDataBuilder.buildPostRequestPayload)(curBatch, caSchema, configs, uploadSessionTag, numEventsTotal), numEventsTotal, uploadSessionTag, configs);
      _checkQueueSizeThenResume(lr, uploadJobQueue);
    } else {
      lr.resume();
    }
  }).on('error', function (err) {
    if (configs.aws) {
      (0, _Logger.getLoggerAWS)().error(JSON.stringify({
        inputFilePath: '' + configs.inputFilePath,
        err: err
      }));
    } else {
      (0, _Logger.getLogger)().error('Error reading input file: ' + configs.inputFilePath, err);
    }
  }).on('end', function () {
    if (batchData.length > 0) {
      (0, _BatchUploadScheduler.scheduleBatchUpload)(uploadJobQueue, batchData, (0, _RequestDataBuilder.buildPostRequestPayload)(batchData, caSchema, configs, uploadSessionTag, numEventsTotal), numEventsTotal, uploadSessionTag, configs);
    }
  });
};

var feedFileFullPath = exports.feedFileFullPath = function feedFileFullPath(inputFilePath) {
  return path.isAbsolute(inputFilePath) ? inputFilePath : path.join(process.cwd(), inputFilePath);
};

var _checkQueueSizeThenResume = function _checkQueueSizeThenResume(lr, uploadJobQueue) {
  waitUntil().interval(WAIT_INTERVAL).times(WAIT_TIMES).condition(function () {
    return uploadJobQueue.length() < MAX_QUEUE_LENGTH;
  }).done(function (result) {
    if (!result) {
      (0, _Logger.getLogger)().warn('Jobs accumulating in the upload queue, possibly due to slow uploads.');
    }
    lr.resume();
  });
};