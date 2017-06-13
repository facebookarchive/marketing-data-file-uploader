'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.detectDelimiterFromLines = exports.detectFileDelimiter = undefined;

var _FeedUploaderConstants = require('./FeedUploaderConstants');

var _FeedUploaderErrorTypes = require('./FeedUploaderErrorTypes');

var _Logger = require('./Logger');

var CSV = require('csv-string'); /**
                                  * Copyright (c) 2017-present, Facebook, Inc.
                                  * All rights reserved.
                                  *
                                  * This source code is licensed under the BSD-style license found in the
                                  * LICENSE file in the root directory of this source tree. An additional grant
                                  * of patent rights can be found in the PATENTS file in the same directory.
                                  *
                                  * 
                                  */

var es = require('event-stream');
var fs = require('fs');

// Returns delimiter detected from the file.  No need to check for single
// column file since there are more than 1 required columns, so there's at least
// one delimiter for each row
var detectFileDelimiter = exports.detectFileDelimiter = function detectFileDelimiter(filePath, callback) {
  var sampleSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _FeedUploaderConstants.DEFAULT_DELIMITER_DETECT_SIZE;

  readSampleLines(filePath, sampleSize, callback);
};

var detectDelimiterFromLines = exports.detectDelimiterFromLines = function detectDelimiterFromLines(lines, callback) {
  if (lines.length > 0) {
    var delimiterDetected = _FeedUploaderConstants.FILE_DELIMITERS.find(function (delim) {
      var numTokens = parseTokens(lines[0], delim);
      return lines.every(function (line) {
        return numTokens > 1 && numTokens == parseTokens(line, delim);
      });
    });
    if (delimiterDetected) {
      callback(delimiterDetected);
      return;
    }
  }
  throw new Error(_FeedUploaderErrorTypes.FILE_DELIMITER_NOT_DETECTED);
};

var parseTokens = function parseTokens(line, delimiter) {
  var parsed = CSV.parse(line, delimiter);
  if (parsed.length > 0) {
    return parsed[0].length;
  }
  return 0;
};

var readSampleLines = function readSampleLines(filePath, sampleSize, callback) {
  var rstream = fs.createReadStream(filePath, {
    flags: 'r',
    encoding: 'utf-8'
  });

  var linesRead = [];

  rstream.pipe(es.split(_FeedUploaderConstants.LINE_BREAK_REGEX)).pipe(es.mapSync(function (line) {
    if (line.length > 0) {
      linesRead.push(line);
    }
    if (linesRead.length >= sampleSize) {
      rstream.emit('end');
    }
  }).on('error', function (err) {
    (0, _Logger.getLogger)().error('Error reading file: ' + filePath, err);
    throw err;
  }).on('end', function () {
    detectDelimiterFromLines(linesRead, callback);
  }));
};