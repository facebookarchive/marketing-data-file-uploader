/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

// Because commander keeps arguments supplied globally, had to separate this
// test without any command line argument from the other ones

import { buildConfigs } from '../ConfigsBuilder';

describe('buildConfigs', () => {
  it('should return error when required config is missing', () => {
    const {err} = buildConfigs(['node', 'somefile']);
    expect(err.message).toMatch(/Missing.*\n.*accessToken/i);
  });
});
