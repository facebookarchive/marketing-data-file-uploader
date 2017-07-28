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

import {batchUploadCallback, uploadEventsBatch} from './EventsUploader';

import type {batchUploadCallbackType} from './EventsUploader';
import type {FeedUploaderConfigs} from './ConfigTypes';

const async = require('async');

export const buildUploadsQueue = (
  configs: FeedUploaderConfigs,
): async.priorityQueue => {
  return async.priorityQueue(uploadBatch);
};

export const scheduleBatchUpload = (
  jobQueue: Object,
  normalizedEventsBatch: Array<?Object>,
  postData: string,
  numEvents: number,
  uploadSessionTag: string,
  configs: FeedUploaderConfigs,
): void => {
  if (normalizedEventsBatch.length > 0) {
    jobQueue.push({
        normalizedEventsBatch: normalizedEventsBatch,
        postData: postData,
        uploadSessionTag: uploadSessionTag,
        numEvents: numEvents,
        configs: configs,
      },
      uploadSessionTag,
      batchUploadCallback
    );
  }
};

const uploadBatch = (
  data: NormalizedBatchData,
  callback: batchUploadCallbackType,
): void => {
  uploadEventsBatch(
    data.normalizedEventsBatch,
    data.postData,
    data.uploadSessionTag,
    _getBatchOffset(data.numEvents, data.normalizedEventsBatch.length),
    data.configs,
    callback,
  );
};

const _getBatchOffset = (
  numEvents: number,
  curBatchSize: number,
): number => {
  return numEvents - curBatchSize;
};

type NormalizedBatchData = {
  normalizedEventsBatch: Array<Object>;
  postData: string;
  uploadSessionTag: string;
  numEvents: number;
  configs: FeedUploaderConfigs;
}
