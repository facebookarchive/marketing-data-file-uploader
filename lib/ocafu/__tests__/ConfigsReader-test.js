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

var _ConfigsReader = require('../ConfigsReader');

var path = require('path');

describe('readConfigsFromFile', function () {
  it('should read config values from a file', function () {
    var configs = (0, _ConfigsReader.readConfigsFromFile)(path.join(__dirname, 'test_config_reader.yml'));
    expect(configs).toEqual({
      dataSetId: 38373873832838,
      inputFilePath: '/PATH/TO/FEED/FILE',
      fileDelimiter: ',',
      uploadTag: 'Offline Sales'
    });
  });

  it('should only read known config options', function () {
    var configs = (0, _ConfigsReader.readConfigsFromFile)(path.join(__dirname, 'test_config_reader.yml'));
    expect(configs.unKnownOption).toEqual(undefined);
  });
});

describe('readConfigsFromCommandLineArgs', function () {
  it('should read config values from command line arguments', function () {
    var configs = (0, _ConfigsReader.readConfigsFromCommandLineArgs)(['node', 'OfflinConversionsFeedUploader.js', 'offline-conversions', '--accessToken', 'ABCDE']);
    expect(configs.accessToken).toEqual('ABCDE');
  });
});