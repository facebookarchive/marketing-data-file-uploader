'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _SampledEventsTester = require('../SampledEventsTester');

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

jest.disableAutomock();

var path = require('path');

var COMMON_CONFIGS = {
  fileHasHeader: true,
  batchSize: 5,
  colMappingInfo: {
    mapping: {
      0: 'match_keys.email',
      1: 'match_keys.email',
      2: 'match_keys.email',
      3: 'match_keys.phone',
      4: 'match_keys.phone',
      5: 'match_keys.phone',
      6: 'match_keys.madid',
      7: 'match_keys.fn',
      8: 'match_keys.ln',
      9: 'match_keys.zip',
      10: 'match_keys.ct',
      11: 'match_keys.st',
      12: 'match_keys.country',
      13: 'match_keys.dob',
      14: 'match_keys.doby',
      15: 'match_keys.gen',
      16: 'match_keys.age',
      17: 'event_name',
      18: 'event_time',
      19: 'value',
      20: 'currency',
      21: 'custom_data.store_num'
    },
    infoForNormalization: {
      dob: 'MM/DD/YY',
      event_time: {
        timeFormat: 'ISO8601'
      }
    },
    customTypeInfo: {
      store_num: {
        key: 'store_num',
        baseType: 'number'
      }
    }
  }
};

describe('testSampledEvents', function () {
  it('should call callback with null error if sampled events look ok', function (done) {
    var inputFilePath = path.join(__dirname, 'example_events_file.csv');
    (0, _SampledEventsTester.testSampledEvents)(_extends({}, COMMON_CONFIGS, { inputFilePath: inputFilePath }), function (err) {
      expect(err).toBeNull();
      done();
    });
  });

  it('should call callback with error if sampled events has too many errors', function (done) {
    var inputFilePath = path.join(__dirname, 'example_events_file_invalid.csv');
    (0, _SampledEventsTester.testSampledEvents)(_extends({}, COMMON_CONFIGS, { inputFilePath: inputFilePath }), function (err) {
      expect(err).not.toBeNull();
      expect(err.message).toMatch(/line 1: {"invalidProps":\["match_keys.dob"\]}/);
      expect(err.message).toMatch(/line 3: {"rejected":true,"missingRequiredProps"/);
      expect(err.message).toMatch(/6 events could not be normalized/);
      done();
    });
  });

  it('should call callback with null if sample has errors, but below threshold', function (done) {
    var inputFilePath = path.join(__dirname, 'example_events_file_barely_valid.csv');
    (0, _SampledEventsTester.testSampledEvents)(_extends({}, COMMON_CONFIGS, { inputFilePath: inputFilePath }), function (err) {
      expect(err).toBeNull();
      done();
    });
  });
});