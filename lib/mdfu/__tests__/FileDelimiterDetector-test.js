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

var _FileDelimiterDetector = require('../FileDelimiterDetector');

var _FeedUploaderErrorTypes = require('../FeedUploaderErrorTypes');

var path = require('path');

jest.unmock('../FileDelimiterDetector').unmock('../FeedUploaderConstants').unmock('winston').unmock('csv-string').unmock('fs').unmock('event-stream');

describe('detectDelimiterFromLines', function () {
  it('should detect comma delimiter', function () {
    var callback = function callback(delimiter) {
      expect(delimiter).toEqual(',');
    };
    (0, _FileDelimiterDetector.detectDelimiterFromLines)(['a,b,c,d,e', 'a,b,c,d,e', 'a,b,c,d,e', 'a,b,c,d,e', 'a,b,c,d,e'], callback);
  });

  it('should detect pipe delimiter', function () {
    var callback = function callback(delimiter) {
      expect(delimiter).toEqual('|');
    };
    (0, _FileDelimiterDetector.detectDelimiterFromLines)(['a|b|c|d|e', 'a|b|c|d|e', 'a|b|c|d|e', 'a|b|c|d|e', 'a|b|c|d|e'], callback);
  });

  it('should detect space delimiter', function () {
    var callback = function callback(delimiter) {
      expect(delimiter).toEqual(' ');
    };
    (0, _FileDelimiterDetector.detectDelimiterFromLines)(['a b c d e', 'a b c d e', 'a b c d e', 'a b c d e', 'a b c d e'], callback);
  });

  it('should detect tab delimiter', function () {
    var callback = function callback(delimiter) {
      expect(delimiter).toEqual('\t');
    };
    (0, _FileDelimiterDetector.detectDelimiterFromLines)(['a\tb\tc\td\te', 'a\tb\tc\td\te', 'a\tb\tc\td\te', 'a\tb\tc\td\te', 'a\tb\tc\td\te'], callback);
  });

  it('should detect semicolon delimiter', function () {
    var callback = function callback(delimiter) {
      expect(delimiter).toEqual(';');
    };
    (0, _FileDelimiterDetector.detectDelimiterFromLines)(['a;b;c;d;e', 'a;b;c;d;e', 'a;b;c;d;e', 'a;b;c;d;e', 'a;b;c;d;e'], callback);
  });

  it('should detect semicolon delimiter', function () {
    var callback = function callback(delimiter) {
      expect(delimiter).toEqual(';');
    };
    (0, _FileDelimiterDetector.detectDelimiterFromLines)(['a;b;c;d,e', 'a;b;c d;e', 'a;b|c;d;e', 'a\tb;c;d;e'], callback);
  });

  it('should detect commas delimiter in quotes', function () {
    var callback = function callback(delimiter) {
      expect(delimiter).toEqual(',');
    };
    (0, _FileDelimiterDetector.detectDelimiterFromLines)(['a,"b,b2",c,d,e', 'a,b,c,d,e', 'a,b,c,d,e', 'a,b,c,d,e', 'a,b,c,d,e'], callback);
  });

  it('should throw for invalid records', function () {
    var callback = function callback(delimiter) {};
    var delimiterTest = function delimiterTest() {
      (0, _FileDelimiterDetector.detectDelimiterFromLines)(['a,b,c,d,e,f', 'a,b,c,d,e', 'a,b,c,d,e', 'a,b,c,d,e', 'a,b,c,d,e'], callback);
    };
    expect(delimiterTest).toThrow(new Error(_FeedUploaderErrorTypes.FILE_DELIMITER_NOT_DETECTED.description));
  });

  it('should throw for single column which is invalid', function () {
    var callback = function callback(delimiter) {};
    var delimiterTest = function delimiterTest() {
      (0, _FileDelimiterDetector.detectDelimiterFromLines)(['a', 'a', 'a', 'a', 'a'], callback);
    };
    expect(delimiterTest).toThrow(new Error(_FeedUploaderErrorTypes.FILE_DELIMITER_NOT_DETECTED.description));
  });
});

describe('detectFileDelimiter', function () {
  it('should detect delimiter in a given file', function (done) {
    var callback = function callback(delimiter) {
      expect(delimiter).toEqual(',');
      done();
    };
    (0, _FileDelimiterDetector.detectFileDelimiter)(path.join(__dirname, 'example_events_file.csv'), callback);
  });
});