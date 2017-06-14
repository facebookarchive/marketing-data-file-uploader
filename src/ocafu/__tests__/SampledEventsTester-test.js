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

import { testSampledEvents } from '../SampledEventsTester';

const path = require('path');

const COMMON_CONFIGS = {
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
    },
  },
  mode: 'offline-conversions',
};

describe('testSampledEvents', () => {
  it('should call callback with null error if sampled events look ok', (done) => {
    const inputFilePath = path.join(__dirname, 'example_events_file.csv');
    testSampledEvents({...COMMON_CONFIGS, inputFilePath}, (err) => {
      expect(err).toBeNull();
      done();
    });
  });

  it('should call callback with error if sampled events has too many errors', (done) => {
    const inputFilePath = path.join(__dirname, 'example_events_file_invalid.csv');
    testSampledEvents({...COMMON_CONFIGS, inputFilePath}, (err) => {
      expect(err).not.toBeNull();
      expect(err.message).toMatch(/line 1: {"invalidProps":\["match_keys.dob"\]}/);
      expect(err.message).toMatch(/line 3: {"rejected":true,"missingRequiredProps"/);
      expect(err.message).toMatch(/6 events could not be normalized/);
      done();
    });
  });

  it('should call callback with null if sample has errors, but below threshold', (done) => {
    const inputFilePath = path.join(__dirname, 'example_events_file_barely_valid.csv');
    testSampledEvents({...COMMON_CONFIGS, inputFilePath}, (err) => {
      expect(err).toBeNull();
      done();
    });
  });
});
