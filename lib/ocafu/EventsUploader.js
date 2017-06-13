'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.batchUploadCallback = exports.uploadEventsBatch = undefined;

var _APISettings = require('./APISettings');

var _UploadSession = require('./UploadSession');

var _Logger = require('./Logger');

var querystring = require('querystring'); /**
                                           * Copyright (c) 2017-present, Facebook, Inc.
                                           * All rights reserved.
                                           *
                                           * This source code is licensed under the BSD-style license found in the
                                           * LICENSE file in the root directory of this source tree. An additional grant
                                           * of patent rights can be found in the PATENTS file in the same directory.
                                           *
                                           * 
                                           */

var https = require('https');

var uploadEventsBatch = exports.uploadEventsBatch = function uploadEventsBatch(events, uploadSessionTag, fileOffset, configs, callback) {
  // Do the real uploading (calling into graph API) if not silent.
  if (configs.silent !== true) {
    (0, _Logger.getLogger)().info('Posting rows ' + (0, _UploadSession.getBatchSigStr)({ offset: fileOffset, size: events.length }) + ' to ' + (0, _APISettings.datasetEndpoint)(configs.dataSetId) + '/events');
    _postEvents(events, fileOffset, configs, uploadSessionTag, callback);
  } else {
    (0, _Logger.getLogger)().info('Silent Mode');
    callback(null, fileOffset, events);
  }
};

var batchUploadCallback = exports.batchUploadCallback = function batchUploadCallback(err, fileOffset, events) {
  if (err === null) {
    (0, _Logger.getLogger)().info('Rows ' + (0, _UploadSession.getBatchSigStr)({ offset: fileOffset, size: events.length }) + ' - ' + ('Successfully uploaded ' + _getValidEvents(events).length + ' events.'));
  } else {
    (0, _Logger.getLogger)().error('Rows ' + (0, _UploadSession.getBatchSigStr)({ offset: fileOffset, size: events.length }) + ' ' + ('- Error uploading ' + _getValidEvents(events).length + ' events: ') + err.message);
  }
};

var _postEvents = function _postEvents(events, fileOffset, configs, uploadSessionTag, callback) {
  var validEvents = _removeInvalidEvents(events, fileOffset);
  var postData = querystring.stringify({
    'data': JSON.stringify(validEvents),
    'access_token': configs.accessToken,
    'upload_tag': uploadSessionTag
  });

  (0, _Logger.getLogger)().silly('postData: ' + postData);

  var options = {
    hostname: 'graph.facebook.com',
    port: 443,
    path: (0, _APISettings.datasetEndpoint)(configs.dataSetId) + '/events',
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
      callback(res.statusCode === 200 ? null : new Error(d), fileOffset, events);
    });
  });

  req.on('error', function (err) {
    (0, _Logger.getLogger)().error(fileOffset + 1 + ' - ' + (fileOffset + events.length) + ': ' + err.message);
    callback(null, fileOffset, events);
  });

  req.write(postData);
  req.end();

  (0, _UploadSession.logBatchUploadStart)(uploadSessionTag, { offset: fileOffset, size: events.length });
};

var _removeInvalidEvents = function _removeInvalidEvents(events, fileOffset, number) {
  var ommitedRows = _getNullElementOffsets(events, fileOffset).join(',');
  if (ommitedRows.length > 0) {
    (0, _Logger.getLogger)().warn('Omitting invalid rows: ' + _getNullElementOffsets(events, fileOffset).join(','));
  }
  return _getValidEvents(events);
};

var _getValidEvents = function _getValidEvents(events) {
  return events.filter(_isValidEvent);
};

var _getNullElementOffsets = function _getNullElementOffsets(events, fileOffset, number) {
  return events.reduce(function (offsets, event, index) {
    if (!_isValidEvent(event)) {
      offsets.push('' + (fileOffset + 1 + index));
    }
    return offsets;
  }, []);
};

var _isValidEvent = function _isValidEvent(event) {
  return event !== null;
};