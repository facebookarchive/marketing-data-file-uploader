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
exports.batchUploadCallback = exports.uploadEventsBatch = undefined;

var _APISettings = require('./APISettings');

var _UploadSession = require('./UploadSession');

var _FeedUploaderConstants = require('./FeedUploaderConstants');

var _Logger = require('./Logger');

var _RequestDataBuilder = require('./RequestDataBuilder');

var https = require('https');

var uploadEventsBatch = exports.uploadEventsBatch = function uploadEventsBatch(events, postData, uploadSessionTag, fileOffset, configs, callback) {
  if (configs.silent !== true) {
    (0, _Logger.getLogger)().info('Posting rows ' + (0, _UploadSession.getBatchSigStr)({ offset: fileOffset, size: events.length }) + ' to ' + (0, _APISettings.datasetEndpoint)(configs.dataSetId, configs.mode));
    _postEvents(events, postData, fileOffset, configs, uploadSessionTag, callback);
  } else {
    (0, _Logger.getLogger)().info('Silent Mode');
    callback(null, fileOffset, events, configs);
  }
};

var batchUploadCallback = exports.batchUploadCallback = function batchUploadCallback(err, fileOffset, events, configs) {
  var rowName = _FeedUploaderConstants.MODE_ROW_NAMES[configs.mode];
  if (err === null) {
    (0, _Logger.getLogger)().info('Rows ' + (0, _UploadSession.getBatchSigStr)({ offset: fileOffset, size: events.length }) + ' - ' + ('Successfully uploaded ' + (0, _RequestDataBuilder.getValidEvents)(events).length + ' ' + rowName + '.'));
  } else {
    (0, _Logger.getLogger)().error('Rows ' + (0, _UploadSession.getBatchSigStr)({ offset: fileOffset, size: events.length }) + ' ' + ('- Error uploading ' + (0, _RequestDataBuilder.getValidEvents)(events).length + ' ' + rowName + ': ') + err.message);
  }
};

var _postEvents = function _postEvents(events, postData, fileOffset, configs, uploadSessionTag, callback) {
  var options = {
    hostname: 'graph.facebook.com',
    port: 443,
    path: (0, _APISettings.datasetEndpoint)(configs.dataSetId, configs.mode),
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  var req = https.request(options, function (res) {
    (0, _Logger.getLogger)().verbose('statusCode: ' + res.statusCode);
    (0, _Logger.getLogger)().debug('headers: ' + JSON.stringify(res.headers));

    res.setEncoding('utf8');
    res.on('data', function (d) {
      (0, _UploadSession.logBatchUploadEnd)(uploadSessionTag, { offset: fileOffset, size: events.length });
      callback(res.statusCode === 200 ? null : new Error(d), fileOffset, events, configs);
    });
  });

  req.on('error', function (err) {
    (0, _Logger.getLogger)().error(fileOffset + 1 + ' - ' + (fileOffset + events.length) + ': ' + err.message);
    callback(null, fileOffset, events, configs);
  });

  req.write(postData);
  req.end();

  (0, _UploadSession.logBatchUploadStart)(uploadSessionTag, { offset: fileOffset, size: events.length });
};