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
exports.testSampledEvents = undefined;

var _FeedFileHandler = require('./FeedFileHandler');

var _Logger = require('./Logger');

var _FeedFileParser = require('./FeedFileParser');

var _FeedUploaderConstants = require('./FeedUploaderConstants');

var _ErrorTypes = require('./ErrorTypes');

var fs = require('fs');
var split = require('split');
var through = require('through2');

var testSampledEvents = exports.testSampledEvents = function testSampledEvents(configs, callback) {
  var rstream = fs.createReadStream((0, _FeedFileHandler.feedFileFullPath)(configs.inputFilePath), {
    flags: 'r',
    encoding: 'utf-8'
  });

  var batchHandler = takeSampledBatch(configs);

  rstream.on('error', function (err) {
    callback(err);
  }).pipe(split(_FeedUploaderConstants.LINE_BREAK_REGEX)).pipe(batchHandler).pipe(through.obj(function (batch, enc, cb) {
    if (batch.length > 0) {
      checkSampledEvents(batch, configs, callback);
    }
    cb();
  }));

  batchHandler.on('end', function () {
    rstream.close();
  });
};

var takeSampledBatch = function takeSampledBatch(configs) {
  var linesRead = 0;
  var batchData = [];

  return through.obj(function (line, enc, cb) {
    linesRead += 1;
    if (linesRead === 1 && configs.fileHasHeader) {} else {
      if (line.length > 0) {
        batchData.push((0, _FeedFileParser.parseAndNormalizeFeedLine)(line, configs));
      }

      if (batchData.length === Math.max(configs.batchSize, _FeedUploaderConstants.MIN_TEST_SAMPLE_SIZE)) {
        this.push(batchData);
        this.emit('end');
      }
    }
    cb();
  }, function (cb) {
    this.push(batchData);
    cb();
  });
};

var checkSampledEvents = function checkSampledEvents(normalizedEvents, configs, callback) {
  var rowName = _FeedUploaderConstants.MODE_ROW_NAMES[configs.mode];
  (0, _Logger.getLogger)().info('STEP 1. Sampled ' + rowName + ' validation test');
  var err = checkInvalidSignalRate(normalizedEvents, rowName);
  if (err) {
    callback(err);
  } else {
    checkSampleMatchRate(normalizedEvents, configs, callback);
  }
};

var checkInvalidSignalRate = function checkInvalidSignalRate(normalizedEvents, rowName) {
  var numRejected = normalizedEvents.reduce(function (numRejected, event) {
    if (!event.normalizedValue) {
      numRejected += 1;
    }
    return numRejected;
  }, 0);

  var errorRate = (numRejected || 0.0) / normalizedEvents.length;

  (0, _Logger.getLogger)().info(numRejected + ' / ' + normalizedEvents.length + ' ' + ('(' + errorRate * 100.0 + '%) signals were invalid'));

  if (errorRate > _FeedUploaderConstants.NORMALIZATION_ERROR_THRESHOLD) {
    return new Error(_ErrorTypes.ERROR_SAMPLE_NORMALIZATION_ERRORS + ': \n\n' + humanReadableNormalizationErrors(normalizedEvents) + ('\n' + numRejected + ' ' + rowName + ' could not be normalized due to error(s).\n\n') + '* After fixing errors in the data, try running the tool in' + ' --testOnly again to check the fixes.\n' + '* Make sure to apply the fix to the entire file, not just sample rows.\n');
  }

  return null;
};

var checkSampleMatchRate = function checkSampleMatchRate(events, configs, callback) {
  callback(null);
};

var humanReadableNormalizationErrors = function humanReadableNormalizationErrors(normalizedEvents) {
  var _normalizedEvents$red = normalizedEvents.reduce(function (errors, event) {
    var nomalizationErrors = {};
    if (!event.normalizedValue) {
      nomalizationErrors['rejected'] = true;
    }
    if (event.missingRequiredProps.length > 0) {
      nomalizationErrors['missingRequiredProps'] = event.missingRequiredProps;
    }
    if (event.invalidProps.length > 0) {
      nomalizationErrors['invalidProps'] = event.invalidProps;
    }
    errors.msg += '- line ' + errors.lineNo + ': ' + JSON.stringify(nomalizationErrors) + '\n';
    errors.lineNo += 1;
    return errors;
  }, { msg: '', lineNo: 1 }),
      msg = _normalizedEvents$red.msg;

  return msg;
};