/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

const path = require('path');

jest
  .unmock('../FileDelimiterDetector')
  .unmock('../FeedUploaderConstants')
  .unmock('winston')
  .unmock('csv-string')
  .unmock('fs')
  .unmock('event-stream');

import { detectDelimiterFromLines, detectFileDelimiter } from '../FileDelimiterDetector';
import { FILE_DELIMITER_NOT_DETECTED } from '../FeedUploaderErrorTypes';

describe('detectDelimiterFromLines', () => {
  it('should detect comma delimiter', () => {
    const callback = (delimiter: string) => {
      expect(delimiter).toEqual(',');
    };
    detectDelimiterFromLines([
      'a,b,c,d,e',
      'a,b,c,d,e',
      'a,b,c,d,e',
      'a,b,c,d,e',
      'a,b,c,d,e',
    ], callback);
  });

  it('should detect pipe delimiter', () => {
    const callback = (delimiter: string) => {
      expect(delimiter).toEqual('|');
    };
    detectDelimiterFromLines([
      'a|b|c|d|e',
      'a|b|c|d|e',
      'a|b|c|d|e',
      'a|b|c|d|e',
      'a|b|c|d|e',
    ], callback);
  });

  it('should detect space delimiter', () => {
    const callback = (delimiter: string) => {
      expect(delimiter).toEqual(' ');
    };
    detectDelimiterFromLines([
      'a b c d e',
      'a b c d e',
      'a b c d e',
      'a b c d e',
      'a b c d e',
    ], callback);
  });

  it('should detect tab delimiter', () => {
    const callback = (delimiter: string) => {
      expect(delimiter).toEqual('\t');
    };
    detectDelimiterFromLines([
      'a\tb\tc\td\te',
      'a\tb\tc\td\te',
      'a\tb\tc\td\te',
      'a\tb\tc\td\te',
      'a\tb\tc\td\te',
    ], callback);
  });

  it('should detect semicolon delimiter', () => {
    const callback = (delimiter: string) => {
      expect(delimiter).toEqual(';');
    };
    detectDelimiterFromLines([
      'a;b;c;d;e',
      'a;b;c;d;e',
      'a;b;c;d;e',
      'a;b;c;d;e',
      'a;b;c;d;e',
    ], callback);
  });

  it('should detect semicolon delimiter', () => {
    const callback = (delimiter: string) => {
      expect(delimiter).toEqual(';');
    };
    detectDelimiterFromLines([
      'a;b;c;d,e',
      'a;b;c d;e',
      'a;b|c;d;e',
      'a\tb;c;d;e',
    ], callback);
  });

  it('should detect commas delimiter in quotes', () => {
    const callback = (delimiter: string) => {
      expect(delimiter).toEqual(',');
    };
    detectDelimiterFromLines([
      'a,"b,b2",c,d,e',
      'a,b,c,d,e',
      'a,b,c,d,e',
      'a,b,c,d,e',
      'a,b,c,d,e',
    ], callback);
  });

  it('should throw for invalid records', () => {
    const callback = (delimiter: string) => {};
    const delimiterTest = () => {
      detectDelimiterFromLines([
        'a,b,c,d,e,f',
        'a,b,c,d,e',
        'a,b,c,d,e',
        'a,b,c,d,e',
        'a,b,c,d,e',
      ], callback);
    };
    expect(delimiterTest).toThrow(new Error(FILE_DELIMITER_NOT_DETECTED));
  });

  it('should throw for single column which is invalid', () => {
    const callback = (delimiter: string) => {};
    const delimiterTest = () => {
      detectDelimiterFromLines([
        'a',
        'a',
        'a',
        'a',
        'a',
      ], callback);
    };
    expect(delimiterTest).toThrow(new Error(FILE_DELIMITER_NOT_DETECTED));
  });
});

describe('detectFileDelimiter', () => {
  it('should detect delimiter in a given file', done => {
    const callback = (delimiter: string) => {
      expect(delimiter).toEqual(',');
      done();
    };
    detectFileDelimiter(path.join(__dirname, 'example_events_file.csv'), callback);
  });
});
