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
import { getLogger, getLoggerAWS } from './Logger';
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

const path = require('path');
const waitUntil = require('wait-until');
const async = require('async');
const LineByLineReader = require('line-by-line');

const MAX_QUEUE_LENGTH = 5;
const WAIT_INTERVAL = 1000;
const WAIT_TIMES = 60;

export const parseAndNormalizeFeedFile = (
  configs: FeedUploaderConfigs,
): void => {
  const lr = new LineByLineReader(feedFileFullPath(configs.inputFilePath), {
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

  lr.on('line', function (line) {
    lr.pause();
    linesRead += 1;
    if (linesRead === 1 && configs.fileHasHeader) {
      lr.resume();
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
      batchData = [];
      scheduleBatchUpload(
        uploadJobQueue,
        curBatch,
        buildPostRequestPayload(curBatch, caSchema, configs, uploadSessionTag, numEventsTotal),
        numEventsTotal,
        uploadSessionTag,
        configs,
      );
      _checkQueueSizeThenResume(lr, uploadJobQueue);
    }
    else{
      lr.resume();
    }
  })
  .on('error', function (err) {
    if (configs.aws) {
      getLoggerAWS().error(JSON.stringify({
        inputFilePath: `${configs.inputFilePath}`,
        err: err
      }));
    }
    else {
      getLogger().error(`Error reading input file: ${configs.inputFilePath}`, err);
    }
  }).on('end', function () {
    if (batchData.length > 0) {
      scheduleBatchUpload(
        uploadJobQueue,
        batchData,
        buildPostRequestPayload(batchData, caSchema, configs, uploadSessionTag, numEventsTotal),
        numEventsTotal,
        uploadSessionTag,
        configs,
      );
    }
  });
};

export const feedFileFullPath = (
  inputFilePath: string
): string => {
  return path.isAbsolute(inputFilePath) ? inputFilePath :
    path.join(process.cwd(), inputFilePath);
};

const _checkQueueSizeThenResume = (
  lr: LineByLineReader,
  uploadJobQueue: async.priorityQueue,
): void => {
  waitUntil()
    .interval(WAIT_INTERVAL)
    .times(WAIT_TIMES)
    .condition(() => {
      return uploadJobQueue.length() < MAX_QUEUE_LENGTH;
    })
    .done((result) => {
      if(!result){
        getLogger().info('Job is taking too long to consume, continue to proceed.');
      }
      lr.resume();
    });
};
