/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

import { extractCASchema } from '../RequestDataBuilder';

const CONFIGS_GOOD = {
  colMappingInfo: {
    mapping: {
      0: 'email',
      1: 'email',
      2: 'email',
      3: 'phone',
      4: 'phone',
      5: 'phone',
      6: 'madid',
      7: 'fn',
      8: 'ln',
      9: 'zip',
      10: 'ct',
      11: 'st',
      12: 'country',
      13: 'dob',
      14: 'doby',
      15: 'gen',
      16: 'age',
    },
  },
};

const CONFIGS_RANDOM_ORDER = {
  colMappingInfo: {
    mapping: {
      7: 'fn',
      1: 'email',
      6: 'madid',
      2: 'email',
      16: 'age',
      3: 'phone',
      5: 'phone',
      8: 'ln',
      12: 'country',
      0: 'email',
      9: 'zip',
      10: 'ct',
      11: 'st',
      13: 'dob',
      4: 'phone',
      15: 'gen',
      14: 'doby',
    },
  },
};

const CONFIGS_WITH_HOLES = {
  colMappingInfo: {
    mapping: {
      17: 'fn',
      3: 'email',
      16: 'madid',
      5: 'email',
      50: 'age',
      6: 'phone',
      11: 'phone',
      22: 'ln',
      40: 'country',
      1: 'email',
      27: 'zip',
      29: 'ct',
      30: 'st',
      43: 'dob',
      9: 'phone',
      47: 'gen',
      44: 'doby',
    },
  },
};

const RESULT_CORRECT = [
  'email',
  'email',
  'email',
  'phone',
  'phone',
  'phone',
  'madid',
  'fn',
  'ln',
  'zip',
  'ct',
  'st',
  'country',
  'dob',
  'doby',
  'gen',
  'age',
];

describe('extractCASchema', () => {
  it('should extract schema correctly', () => {
    const schema = extractCASchema(CONFIGS_GOOD.colMappingInfo.mapping);
    expect(schema).toEqual(RESULT_CORRECT);
  });

  it('should extract schema correctly if mapping is not in order', () => {
    const schema = extractCASchema(CONFIGS_RANDOM_ORDER.colMappingInfo.mapping);
    expect(schema).toEqual(RESULT_CORRECT);
  });

  it('should extract schema correctly if mapping is not consecutive', () => {
    const schema = extractCASchema(CONFIGS_WITH_HOLES.colMappingInfo.mapping);
    expect(schema).toEqual(RESULT_CORRECT);
  });
});
