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

import { buildUploadsQueue, scheduleBatchUpload } from './BatchUploadScheduler';
import { parseAndNormalizeFeedLine } from './FeedFileParser';
import { createUploadSessionTag } from './UploadSession';
import { getLogger } from './Logger';
import {
  LINE_BREAK_REGEX,
  MODE_OC,
  MODE_CA,
} from './FeedUploaderConstants'

import {
  buildPostRequestPayload,
  extractCASchema,
  removeInvalidEvents,
} from './RequestDataBuilder';

import type { FeedUploaderConfigs } from './ConfigTypes';
import type { MappingsType } from '../SignalsSchema/SignalsSchemaValidationTypes';

const es = require('event-stream');
const fs = require('fs');
const path = require('path');
const split = require('split');

export const parseAndNormalizeFeedFile = (
  configs: FeedUploaderConfigs,
): void => {
  const rstream = fs.createReadStream(feedFileFullPath(configs.inputFilePath), {
    flags: 'r',
    encoding: 'utf-8',
  });
  const uploadJobQueue = buildUploadsQueue(configs);
  const uploadSessionTag = createUploadSessionTag(configs);

  let numEventsTotal = 0;
  let linesRead = 0;
  let batchData = [];

  getLogger().info(`Upload tag: ${uploadSessionTag}`);

  let caSchema;
  if (configs.mode === MODE_CA) {
    caSchema = extractCASchema(configs.colMappingInfo.mapping);
  }

  rstream
    .pipe(split(LINE_BREAK_REGEX))
    .pipe(es.mapSync(line => {
      linesRead += 1;
      if (linesRead === 1 && configs.fileHasHeader) {
        return;
      }

      if (line.length > 0) {
        batchData.push(parseAndNormalizeFeedLine(
          line,
          configs,
        ).normalizedValue);
        numEventsTotal += 1;
      }

      if (batchData.length % configs.batchSize === 0) {
        const curBatch = batchData;
        const validBatch = removeInvalidEvents(batchData, numEventsTotal);
        batchData = [];
        scheduleBatchUpload(
          uploadJobQueue,
          curBatch,
          buildPostRequestPayload(validBatch, caSchema, configs, uploadSessionTag),
          numEventsTotal,
          uploadSessionTag,
          configs,
        );
      }
    })
    .on('error', (err) => {
      getLogger().error(`Error reading input file: ${configs.inputFilePath}`, err);
    })
    .on('end', () => {
      if (batchData.length > 0) {
        const validBatch = removeInvalidEvents(batchData, numEventsTotal);
        scheduleBatchUpload(
          uploadJobQueue,
          batchData,
          buildPostRequestPayload(validBatch, caSchema, configs, uploadSessionTag),
          numEventsTotal,
          uploadSessionTag,
          configs,
        );
      }
    }));
};

export const feedFileFullPath = (
  inputFilePath: string
): string => {
  return path.isAbsolute(inputFilePath) ? inputFilePath :
    path.join(process.cwd(), inputFilePath);
};
