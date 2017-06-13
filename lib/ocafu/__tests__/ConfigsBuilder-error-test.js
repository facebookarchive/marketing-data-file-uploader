'use strict';

var _ConfigsBuilder = require('../ConfigsBuilder');

describe('buildConfigs', function () {
  it('should return error when command is missing', function () {
    var _buildConfigs = (0, _ConfigsBuilder.buildConfigs)(['node', 'somefile']),
        err = _buildConfigs.err;

    expect(err.message).toMatch(/Command is not specified.*/);
  });

  it('should return error when command is unknown', function () {
    var _buildConfigs2 = (0, _ConfigsBuilder.buildConfigs)(['node', 'somefile', 'somecommand']),
        err = _buildConfigs2.err;

    expect(err.message).toMatch(/Command is not specified.*/);
  });

  it('should return error when required config is missing', function () {
    var _buildConfigs3 = (0, _ConfigsBuilder.buildConfigs)(['node', 'somefile', 'offline-conversions']),
        err = _buildConfigs3.err;

    expect(err.message).toMatch(/Missing.*\n.*accessToken/i);
  });
}); /**
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