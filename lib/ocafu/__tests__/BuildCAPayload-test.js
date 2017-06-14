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

var _RequestDataBuilder = require('../RequestDataBuilder');

var DATA = [{
  phone: ['+1 212 301 1234', '+1 212 301 4567'],
  email: ['abc@abc.com', '123@123.com', 'xyz@xyz.com'],
  doby: '1972',
  dobm: '10',
  dobd: '24',
  ln: 'Doe',
  fn: 'John',
  fi: 'J',
  f5first: 'John',
  f5last: 'Doe'
}, {
  fn: 'Jane',
  ln: 'Doe',
  email: 'jd@fb.com',
  gen: 'F'
}, {
  doby: '1987',
  fn: 'Greatest',
  ln: 'Ever'
}];

var SCHEMA = ['email', 'email', 'email', 'phone', 'phone', 'phone', 'fn', 'ln', 'dob', 'age', 'gen'];

var PAYLOAD = {
  data: [['abc@abc.com', '123@123.com', 'xyz@xyz.com', '+1 212 301 1234', '+1 212 301 4567', '', 'John', 'J', 'John', 'Doe', 'Doe', '1972', '10', '24', ''], ['jd@fb.com', 'jd@fb.com', 'jd@fb.com', '', '', '', 'Jane', '', '', 'Doe', '', '', '', '', 'F'], ['', '', '', '', '', '', 'Greatest', '', '', 'Ever', '', '1987', '', '', '']],
  schema: ['EMAIL', 'EMAIL', 'EMAIL', 'PHONE', 'PHONE', 'PHONE', 'FN', 'FI', 'F5FIRST', 'LN', 'F5LAST', 'DOBY', 'DOBM', 'DOBD', 'GEN']
};

describe('buildCAPayload', function () {
  it('should build request payload correctly', function () {
    var payload = (0, _RequestDataBuilder.buildCAPayload)(DATA, SCHEMA);
    expect(payload).toEqual(JSON.stringify(PAYLOAD));
  });
});