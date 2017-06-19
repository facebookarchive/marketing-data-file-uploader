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

// Upload session ID is used mainly for progress tracking to enable the tool
// to resume processing from the last batch processed instead of processing the
// while file again.
import { getLogger } from './Logger';

import type { FeedUploaderConfigs } from './ConfigTypes';

const fs = require('fs');
const path = require('path');

export type EventBatchSignature = {
  offset: number;
  size: number;
};

export const createUploadSessionTag = (
  configs: FeedUploaderConfigs,
): string => {
  return configs.uploadTag ? configs.uploadTag :
    buildUploadTagWithPrefix(configs.uploadTagPrefix, configs.inputFilePath);
};

export const logBatchUploadStart = (
  sessionId: string,
  batchSig: EventBatchSignature,
): void => {
  _logLocal(sessionId, batchSig, 'upload_start');
};

export const logBatchUploadEnd = (
  sessionId: string,
  batchSig: EventBatchSignature,
): void => {
  _logLocal(sessionId, batchSig, 'upload_end');
};

export const getBatchSigStr = (
  batchSig: EventBatchSignature,
): string => {
  return `${batchSig.offset+1} - ${batchSig.offset + batchSig.size}`;
};

const buildUploadTagWithPrefix = (
  uploadTagPrefix: string,
  filePath: string,
): string => {
  return `${uploadTagPrefix} (${getFileSignature(filePath)})`;
};

const getFileSignature = (
  filepath: string,
): string => {
  const filestat = fs.statSync(filepath);
  return `${path.basename(filepath)}@${Date.parse(filestat.mtime.toUTCString())}`;
};

const _logLocal = (
  sessionId: string,
  batchSig: EventBatchSignature,
  eventType: string,
): void => {
  getLogger().debug(`Batch ${eventType}: ${getBatchSigStr(batchSig)}`);
};
