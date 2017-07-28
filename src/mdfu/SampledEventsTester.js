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

import { feedFileFullPath } from './FeedFileHandler';
import { getLogger, getLoggerAWS } from './Logger';
import { parseAndNormalizeFeedLine } from './FeedFileParser';
import {
  NORMALIZATION_ERROR_THRESHOLD,
  MIN_TEST_SAMPLE_SIZE,
  LINE_BREAK_REGEX,
  MODE_ROW_NAMES,
} from './FeedUploaderConstants';
import { ERROR_SAMPLE_NORMALIZATION_ERRORS } from './ErrorTypes';

import type { FeedUploaderConfigs } from './ConfigTypes';
import type { NormalizationResult } from '../SignalsSchema/SignalsSchemaValidationTypes';

const fs = require('fs');
const split = require('split');
const through = require('through2');

export const testSampledEvents = (
  configs: FeedUploaderConfigs,
  callback: (err: ?Error) => void,
): void => {
  const rstream = fs.createReadStream(feedFileFullPath(configs.inputFilePath), {
    flags: 'r',
    encoding: 'utf-8',
  });

  const batchHandler = takeSampledBatch(configs);

  rstream
    .on('error', (err) => {
      callback(err);
    })
    .pipe(split(LINE_BREAK_REGEX))
    .pipe(batchHandler)
    .pipe(through.obj((batch, enc, cb) => {
      if (batch.length > 0) {
        checkSampledEvents(batch, configs, callback);
      }
      cb();
    }));

  batchHandler
    .on('end', () => {
      rstream.close();
    });
};

// Currently, only take the 1st batch or MIN_TEST_SAMPLE_SIZE events as sample.
const takeSampledBatch = (configs: FeedUploaderConfigs) => {
  let linesRead = 0;
  let batchData = [];

  return through.obj(
    function(line, enc, cb) {
      linesRead += 1;
      if (linesRead === 1 && configs.fileHasHeader) {
      } else {
        if (line.length > 0) {
          batchData.push(parseAndNormalizeFeedLine(line, configs));
        }

        if (batchData.length
          === Math.max(configs.batchSize, MIN_TEST_SAMPLE_SIZE)) {
          this.push(batchData);
          this.emit('end');
        }
      }
      cb();
    },
    function(cb) {
      this.push(batchData);
      cb();
    }
  );
};

const checkSampledEvents = (
  normalizedEvents: Array<NormalizationResult>,
  configs: FeedUploaderConfigs,
  callback: (err: ?Error) => void,
): void => {
  const rowName = MODE_ROW_NAMES[configs.mode];
  getLogger().info(`STEP 1. Sampled ${rowName} validation test`);
  const err = checkInvalidSignalRate(normalizedEvents, rowName, configs);
  if (err) {
    callback(err);
  } else {
    checkSampleMatchRate(normalizedEvents, configs, callback);
  }
};

const checkInvalidSignalRate = (
  normalizedEvents: Array<NormalizationResult>,
  rowName: string,
  configs: FeedUploaderConfigs,
): ?Error => {

  // Only check ratio of completed rejected signal that didn't produce
  // normalizedValue.  A signal with invalid props could still get normalized
  const numRejected = normalizedEvents.reduce((numRejected, event) => {
    if (!event.normalizedValue) {
      numRejected += 1;
    }
    return numRejected;
  }, 0);

  const errorRate = (numRejected || 0.0) / normalizedEvents.length;

  getLogger().info(`${numRejected} / ${normalizedEvents.length} ` +
    `(${errorRate * 100.0}%) signals were invalid`);

  if (errorRate > NORMALIZATION_ERROR_THRESHOLD) {
    if (configs.aws) {
      return new Error(
        JSON.stringify({
          err: ERROR_SAMPLE_NORMALIZATION_ERRORS,
          event: humanReadableNormalizationErrors(normalizedEvents),
          numRejected: `${numRejected}`,
          rowName: `${rowName}`
        })
      );
    } else {
      return new Error(
        `${ERROR_SAMPLE_NORMALIZATION_ERRORS.description}: \n\n`
        + humanReadableNormalizationErrors(normalizedEvents, configs)
        + `\n${numRejected} ${rowName} could not be normalized due to error(s).\n\n`
        + '* After fixing errors in the data, try running the tool in'
        + ' --testOnly again to check the fixes.\n'
        + '* Make sure to apply the fix to the entire file, not just sample rows.\n'
      );
    }
  }

  return null;
};

const checkSampleMatchRate = (
  events: Array<NormalizationResult>,
  configs: FeedUploaderConfigs,
  callback: (err: ?Error) => void,
): void => {
  // TODO:  Upload batch to 'validate' endpoint.  Check match rate.  throw
  //        Matchrate too low error.
  callback(null);
};

const humanReadableNormalizationErrors = (
  normalizedEvents: Array<NormalizationResult>,
): string => {
  const { msg } = normalizedEvents.reduce((errors, event) => {
    const nomalizationErrors = {};
    if (!event.normalizedValue) {
      nomalizationErrors['rejected'] = true;
    }
    if (event.missingRequiredProps.length > 0) {
      nomalizationErrors['missingRequiredProps'] = event.missingRequiredProps;
    }
    if (event.invalidProps.length > 0) {
      nomalizationErrors['invalidProps'] = event.invalidProps;
    }
    errors.msg += `- line ${errors.lineNo}: ${JSON.stringify(nomalizationErrors)}\n`;
    errors.lineNo += 1;
    return errors;
  }, {msg: '', lineNo: 1});
  return msg;
};
