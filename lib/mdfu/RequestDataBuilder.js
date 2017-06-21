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
exports.getValidEvents = exports.removeInvalidEvents = exports.buildCAPayload = exports.extractCASchema = exports.buildPostRequestPayload = undefined;

var _FeedUploaderConstants = require('./FeedUploaderConstants');

var _ErrorTypes = require('./ErrorTypes');

var _Logger = require('./Logger');

var querystring = require('querystring');

var buildPostRequestPayload = exports.buildPostRequestPayload = function buildPostRequestPayload(events, caSchema, configs, uploadSessionTag) {
  var postData = {
    'data': undefined,
    'payload': undefined,
    'access_token': configs.accessToken,
    'upload_tag': uploadSessionTag
  };

  switch (configs.mode) {
    case _FeedUploaderConstants.MODE_OC:
      postData.data = JSON.stringify(events);
      break;
    case _FeedUploaderConstants.MODE_CA:
      if (!caSchema) {
        throw Error('CA Schema is missing.');
      }
      postData.payload = buildCAPayload(events, caSchema);
      break;
    default:
      throw new Error(_ErrorTypes.UNSUPPORTED_MODE);
  }

  for (var key in postData) {
    if (!postData[key]) {
      delete postData[key];
    }
  }

  postData = querystring.stringify(postData);
  (0, _Logger.getLogger)().silly('postData: ' + postData);
  return postData;
};

var extractCASchema = exports.extractCASchema = function extractCASchema(mapping) {
  var result = [];
  for (var index in mapping) {
    var i = Number(index);
    if (i !== NaN) {
      result[i] = mapping[index];
    }
  }
  return result.filter(function (x) {
    return x;
  });
};

var buildCAPayload = exports.buildCAPayload = function buildCAPayload(records, schema) {
  var filteredSchema = [];
  schema.forEach(function (s) {
    switch (s) {
      case 'fn':
        filteredSchema.push(s);
        filteredSchema.push('fi');
        filteredSchema.push('f5first');
        break;
      case 'ln':
        filteredSchema.push(s);
        filteredSchema.push('f5last');
        break;
      case 'dob':
        filteredSchema.push('doby');
        filteredSchema.push('dobm');
        filteredSchema.push('dobd');
        break;
      case 'doby':
      case 'age':
        if (!filteredSchema.includes('doby')) {
          filteredSchema.push('doby');
        }
        break;
      default:
        filteredSchema.push(s);
        break;
    }
  });

  var lines = [];
  for (var i = 0; i < records.length; ++i) {
    if (records[i]) {
      var entries = [];
      for (var j = 0; j < filteredSchema.length; ++j) {
        var value = records[i][filteredSchema[j]];
        if (Array.isArray(value)) {
          value = value.shift() || '';
        } else if (value === undefined) {
          value = '';
        }
        entries.push(value);
      }
      lines.push(entries);
    }
  }

  var payload = {
    data: lines,
    schema: filteredSchema.map(function (s) {
      return s.toUpperCase();
    })
  };

  return JSON.stringify(payload);
};

var removeInvalidEvents = exports.removeInvalidEvents = function removeInvalidEvents(events, totalNumEvents) {
  var ommitedRows = _getNullElementIndices(events, totalNumEvents).join(',');
  if (ommitedRows.length > 0) {
    (0, _Logger.getLogger)().warn('Omitting invalid rows: ' + _getNullElementIndices(events, totalNumEvents).join(','));
  }
  return getValidEvents(events);
};

var getValidEvents = exports.getValidEvents = function getValidEvents(events) {
  return events.filter(_isValidEvent);
};

var _getNullElementIndices = function _getNullElementIndices(events, totalNumEvents) {

  return events.reduce(function (indices, event, index) {
    if (!_isValidEvent(event)) {
      indices.push('' + (totalNumEvents - events.length + 1 + index));
    }
    return indices;
  }, []);
};

var _isValidEvent = function _isValidEvent(event) {
  return event !== null && event !== undefined;
};