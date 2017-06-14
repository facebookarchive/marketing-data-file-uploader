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

var es = require('event-stream');
var fs = require('fs');
var path = require('path');
var split = require('split');

var parseAndNormalizeFeedFile = exports.parseAndNormalizeFeedFile = function parseAndNormalizeFeedFile(configs) {
  var rstream = fs.createReadStream(feedFileFullPath(configs.inputFilePath), {
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

  rstream.pipe(split(_FeedUploaderConstants.LINE_BREAK_REGEX)).pipe(es.mapSync(function (line) {
    linesRead += 1;
    if (linesRead === 1 && configs.fileHasHeader) {
      return;
    }

    if (line.length > 0) {
      batchData.push((0, _FeedFileParser.parseAndNormalizeFeedLine)(line, configs).normalizedValue);
      numEventsTotal += 1;
    }

    if (batchData.length % configs.batchSize === 0) {
      var curBatch = batchData;
      var validBatch = (0, _RequestDataBuilder.removeInvalidEvents)(batchData, numEventsTotal);
      batchData = [];
      (0, _BatchUploadScheduler.scheduleBatchUpload)(uploadJobQueue, curBatch, (0, _RequestDataBuilder.buildPostRequestPayload)(validBatch, caSchema, configs, uploadSessionTag), numEventsTotal, uploadSessionTag, configs);
    }
  }).on('error', function (err) {
    (0, _Logger.getLogger)().error('Error reading input file: ' + configs.inputFilePath, err);
  }).on('end', function () {
    if (batchData.length > 0) {
      var validBatch = (0, _RequestDataBuilder.removeInvalidEvents)(batchData, numEventsTotal);
      (0, _BatchUploadScheduler.scheduleBatchUpload)(uploadJobQueue, batchData, (0, _RequestDataBuilder.buildPostRequestPayload)(validBatch, caSchema, configs, uploadSessionTag), numEventsTotal, uploadSessionTag, configs);
    }
  }));
};

var feedFileFullPath = exports.feedFileFullPath = function feedFileFullPath(inputFilePath) {
  return path.isAbsolute(inputFilePath) ? inputFilePath : path.join(process.cwd(), inputFilePath);
};