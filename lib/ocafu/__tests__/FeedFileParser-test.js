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

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _FeedFileParser = require('../FeedFileParser');

jest.disableAutomock();

var CONFIGS_GOOD = {
  colMappingInfo: {
    mapping: {
      0: 'match_keys.email',
      1: 'match_keys.phone',
      2: 'match_keys.dob',
      3: 'event_name',
      4: 'event_time',
      5: 'custom_data.store_id',
      6: 'value',
      7: 'currency'
    },
    infoForNormalization: {
      dob: 'MM/DD/YY',
      event_time: {
        timeFormat: 'ISO8601'
      }
    },
    customTypeInfo: {
      store_id: {
        baseType: 'number',
        key: 'store_id'
      }
    }
  },
  mode: 'offline-conversions'
};

describe('parseAndNormalizeFeedLine', function () {
  it('should normalize and hash match keys correctly', function () {
    var normlizationResult = (0, _FeedFileParser.parseAndNormalizeFeedLine)('elizabetho@fb.com,1-(650)-561-5622,10/21/68,Purchase,' + '2017-01-10T03:21:48Z,1115,15,USD', CONFIGS_GOOD);
    expect(normlizationResult.normalizedValue).toEqual({
      currency: 'USD',
      event_name: 'Purchase',
      event_time: 1484018508,
      value: 15,
      custom_data: {
        store_id: 1115
      },
      match_keys: {
        email: '23b9cb38c8e9c75a466a349eec16aff2c3eabc707cf57432a872aab7e532d069',
        phone: 'c7e1a5948418c64b472abbe6a7b443ec83c4e31573874d600de828f89dd71339',
        dobd: '6f4b6612125fb3a0daecd2799dfd6c9c299424fd920f9b308110a2c1fbd8f443',
        dobm: '4a44dc15364204a80fe80e9039455cc1608281820fe2b24f1e5233ade6af1dd5',
        doby: 'a48622b535728587fd351763d1296c7ec9cb5bc6743d5f22b011d5b5c3ef688f'
      }
    });
  });

  it('should normalize dates with inforForNormalization correctly', function () {
    var infoForNormalization = {
      dob: 'MM/DD/YYYY',
      event_time: {
        timeFormat: 'ISO8601'
      }
    };
    var normlizationResult = (0, _FeedFileParser.parseAndNormalizeFeedLine)('elizabetho@fb.com,1-(650)-561-5622,10/21/1968,Purchase,' + '2017-01-10T03:21:48Z,1115,15,USD', {
      colMappingInfo: _extends({}, CONFIGS_GOOD.colMappingInfo, {
        infoForNormalization: infoForNormalization
      }),
      mode: 'offline-conversions'
    });
    expect(normlizationResult.normalizedValue.match_keys.dobd).toEqual('6f4b6612125fb3a0daecd2799dfd6c9c299424fd920f9b308110a2c1fbd8f443');
    expect(normlizationResult.normalizedValue.match_keys.dobm).toEqual('4a44dc15364204a80fe80e9039455cc1608281820fe2b24f1e5233ade6af1dd5');
    expect(normlizationResult.normalizedValue.match_keys.doby).toEqual('a48622b535728587fd351763d1296c7ec9cb5bc6743d5f22b011d5b5c3ef688f');
  });

  it('should normalize dates with customTypeInfo correctly', function () {
    var customTypeInfo = {
      store_id: {
        baseType: 'string',
        key: 'store_id'
      }
    };
    var normlizationResult = (0, _FeedFileParser.parseAndNormalizeFeedLine)('elizabetho@fb.com,1-(650)-561-5622,10/21/1968,Purchase,' + '2017-01-10T03:21:48Z,1115,15,USD', {
      colMappingInfo: _extends({}, CONFIGS_GOOD.colMappingInfo, {
        customTypeInfo: customTypeInfo
      }),
      mode: 'offline-conversions'
    });
    expect(normlizationResult.normalizedValue.custom_data.store_id).toEqual('1115');
  });
});