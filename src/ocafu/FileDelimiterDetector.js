/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

import { DEFAULT_DELIMITER_DETECT_SIZE, FILE_DELIMITERS, LINE_BREAK }
  from './FeedUploaderConstants';
import { FILE_DELIMITER_NOT_DETECTED } from './FeedUploaderErrorTypes';
import { getLogger } from './Logger';

const CSV = require('csv-string');
const es = require('event-stream');
const fs = require('fs');

// Returns delimiter detected from the file.  No need to check for single
// column file since there are more than 1 required columns, so there's at least
// one delimiter for each row
export const detectFileDelimiter = (
  filePath: string,
  callback: (delim: string) => void,
  sampleSize: number = DEFAULT_DELIMITER_DETECT_SIZE,
): void => {
  readSampleLines(filePath, sampleSize, callback);
};

export const detectDelimiterFromLines = (
  lines: Array<string>,
  callback: (delim: string) => void,
): void => {
  if (lines.length > 0) {
    const delimiterDetected = FILE_DELIMITERS.find(delim => {
      const numTokens = parseTokens(lines[0], delim);
      return lines.every(line => numTokens > 1
        && numTokens == parseTokens(line, delim));
    });
    if (delimiterDetected) {
      callback(delimiterDetected);
      return;
    }
  }
  throw new Error(FILE_DELIMITER_NOT_DETECTED);
};

const parseTokens = (
  line: string,
  delimiter: string,
): number => {
  const parsed = CSV.parse(line, delimiter);
  if (parsed.length > 0) {
    return parsed[0].length;
  }
  return 0;
};

const readSampleLines = (
  filePath: string,
  sampleSize: number,
  callback: (delim: string) => void,
): void => {
  const rstream = fs.createReadStream(filePath, {
    flags: 'r',
    encoding: 'utf-8',
  });

  let linesRead = [];

  rstream
    .pipe(es.split(LINE_BREAK))
    .pipe(es.mapSync(line => {
      if (line.length > 0) {
        linesRead.push(line);
      }
      if (linesRead.length >= sampleSize) {
        rstream.emit('end');
      }
    })
    .on('error', (err) => {
      getLogger().error(`Error reading file: ${filePath}`, err);
      throw (err);
    })
    .on('end', () => {
      detectDelimiterFromLines(linesRead, callback);
    }));
};
