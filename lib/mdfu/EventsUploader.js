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
exports.getCaNameFromFilePath = exports.createCustomAudience = exports.batchUploadCallback = exports.uploadEventsBatch = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _APISettings = require('./APISettings');

var _UploadSession = require('./UploadSession');

var _FeedUploaderConstants = require('./FeedUploaderConstants');

var _Logger = require('./Logger');

var _RequestDataBuilder = require('./RequestDataBuilder');

var _ErrorTypes = require('./ErrorTypes');

var https = require('https');
var querystring = require('querystring');

var uploadEventsBatch = exports.uploadEventsBatch = function uploadEventsBatch(events, postData, uploadSessionTag, fileOffset, configs, callback) {
  if (configs.silent !== true) {
    (0, _Logger.getLogger)().info('Posting rows ' + (0, _UploadSession.getBatchSigStr)({ offset: fileOffset, size: events.length }) + ' to ' + (0, _APISettings.datasetEndpoint)(configs));
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
    if (configs.aws) {
      (0, _Logger.getLoggerAWS)().error(JSON.stringify({
        Rows: '' + (0, _UploadSession.getBatchSigStr)({ offset: fileOffset, size: events.length }),
        rowName: '' + rowName,
        err: err.message
      }));
    } else {
      (0, _Logger.getLogger)().error('Rows ' + (0, _UploadSession.getBatchSigStr)({ offset: fileOffset, size: events.length }) + ' ' + ('- Error uploading ' + (0, _RequestDataBuilder.getValidEvents)(events).length + ' ' + rowName + ': ') + err.message);
    }
  }
};

var _postEvents = function _postEvents(events, postData, fileOffset, configs, uploadSessionTag, callback) {
  var options = _extends({
    hostname: 'graph.facebook.com',
    port: 443,
    path: (0, _APISettings.datasetEndpoint)(configs),
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  }, configs.httpsOptions);

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
    callback(err, fileOffset, events, configs);
  });

  req.write(postData);
  req.end();

  (0, _UploadSession.logBatchUploadStart)(uploadSessionTag, { offset: fileOffset, size: events.length });
};

var createCustomAudience = exports.createCustomAudience = function createCustomAudience(configs, callback) {
  if (configs.mode !== _FeedUploaderConstants.MODE_CA) {
    callback(configs);
    return;
  }

  if (configs.customAudienceId) {
    callback(configs);
    return;
  }

  if (!configs.adAccountId) {
    if (configs.aws) {
      (0, _Logger.getLoggerAWS)().error(_ErrorTypes.ERROR_NO_CA_ID_OR_ACT_ID);
    } else {
      (0, _Logger.getLogger)().error(_ErrorTypes.ERROR_NO_CA_ID_OR_ACT_ID.description);
    }
    return;
  }

  var postData = {
    name: getCaNameFromFilePath(configs.inputFilePath),
    subtype: 'CUSTOM',
    access_token: configs.accessToken
  };

  (0, _Logger.getLogger)().info('Creating a new custom audience (name: ' + postData.name + ') ...');

  postData = querystring.stringify(postData);
  (0, _Logger.getLogger)().silly('postData: ' + postData);

  var options = _extends({
    hostname: 'graph.facebook.com',
    port: 443,
    path: (0, _APISettings.createCAEndpoint)(configs),
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  }, configs.httpsOptions);

  var req = https.request(options, function (res) {
    (0, _Logger.getLogger)().verbose('statusCode: ' + res.statusCode);
    (0, _Logger.getLogger)().debug('headers: ' + JSON.stringify(res.headers));

    res.setEncoding('utf8');
    res.on('data', function (d) {
      d = JSON.parse(d);
      if (d.error) {
        if (configs.aws) {
          (0, _Logger.getLoggerAWS)().error(JSON.stringify({ failedAPIRes: '' + JSON.stringify(d.error) }));
        } else {
          (0, _Logger.getLogger)().error('Custom audience creation failed. API responded:\n' + JSON.stringify(d.error));
        }
      } else if (d.id) {
        (0, _Logger.getLogger)().info('Created a new custom audience (id: ' + d.id + ')');
        configs.customAudienceId = d.id;
        callback(configs);
      } else {
        if (configs.aws) {
          (0, _Logger.getLoggerAWS)().error(JSON.stringify({ unknownErrRes: '' + JSON.stringify(d) }));
        } else {
          (0, _Logger.getLogger)().error('Unknown error when creating custom audience. Response: ' + JSON.stringify(d));
        }
      }
    });
  });

  req.on('error', function (err) {
    if (configs.aws) {
      (0, _Logger.getLoggerAWS)().error(err.message);
    } else {
      (0, _Logger.getLogger)().error(err.message);
    }
  });

  req.write(postData);
  req.end();
};

var getCaNameFromFilePath = exports.getCaNameFromFilePath = function getCaNameFromFilePath(path) {
  var date = new Date();
  var dateString = '_' + date.toISOString().slice(0, 10);

  return path.replace(/^.*[\\\/]/, '').replace(/\.[^\.]+$/, '') + dateString;
};