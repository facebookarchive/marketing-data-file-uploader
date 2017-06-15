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

import { datasetEndpoint } from './APISettings';
import type { FeedUploaderConfigs } from './ConfigTypes';
import { getBatchSigStr, logBatchUploadStart, logBatchUploadEnd } from './UploadSession';
import {
  MODE_ROW_NAMES,
  MODE_CA,
  MODE_OC,
} from './FeedUploaderConstants';
import { getLogger } from './Logger';
import { getValidEvents } from './RequestDataBuilder';
import { UNSUPPORTED_MODE } from './ErrorTypes';

const https = require('https');

export const uploadEventsBatch = (
  events: Array<Object>,
  postData: string,
  uploadSessionTag: string,
  fileOffset: number,
  configs: FeedUploaderConfigs,
  callback: batchUploadCallbackType,
): void => {
  // Do the real uploading (calling into graph API) if not silent.
  if (configs.silent !== true) {
    getLogger().info(
      `Posting rows ${getBatchSigStr({offset: fileOffset, size: events.length})} to \
${datasetEndpoint(configs.dataSetId, configs.mode)}`
    );
    _postEvents(events, postData, fileOffset, configs, uploadSessionTag, callback);
  } else {
    getLogger().info('Silent Mode');
    callback(null, fileOffset, events, configs);
  }
};

export const batchUploadCallback = (
  err: Error,
  fileOffset: number,
  events: Array<?Object>,
  configs: FeedUploaderConfigs,
): void => {
  const rowName = MODE_ROW_NAMES[configs.mode];
  if (err === null) {
    getLogger().info(
      `Rows ${getBatchSigStr({offset: fileOffset, size: events.length})} - ` +
      `Successfully uploaded ${getValidEvents(events).length} ${rowName}.`
    );
  } else {
    getLogger().error(
      `Rows ${getBatchSigStr({offset: fileOffset, size: events.length})} ` +
      `- Error uploading ${getValidEvents(events).length} ${rowName}: ` +
      err.message
    );
  }
};

export type batchUploadCallbackType = (
  err: ?Error,
  fileOffset: number,
  events: Array<Object>,
  configs: FeedUploaderConfigs,
) => void;

const _getAPIEndpoint = (configs: FeedUploaderConfigs): string => {
  switch (configs.mode) {
    case MODE_OC:
      return datasetEndpoint(configs.dataSetId, configs.mode);
    case MODE_CA:
      return datasetEndpoint(configs.customAudienceId, configs.mode);
    default:
      throw new Error(UNSUPPORTED_MODE);
  }
}

const _postEvents = (
  events: Array<Object>,
  postData: string,
  fileOffset: number,
  configs: FeedUploaderConfigs,
  uploadSessionTag: string,
  callback: batchUploadCallbackType,
): void => {

  const options = {
    hostname: 'graph.facebook.com',
    port: 443,
    path: _getAPIEndpoint(configs),
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = https.request(options, (res) => {
    getLogger().verbose(`statusCode: ${res.statusCode}`);
    getLogger().debug(`headers: ${JSON.stringify(res.headers)}`);

    res.setEncoding('utf8');
    res.on('data', (d) => {
      logBatchUploadEnd(
        uploadSessionTag,
        {offset: fileOffset, size: events.length},
      );
      callback(
        res.statusCode === 200 ? null : new Error(d),
        fileOffset,
        events,
        configs,
      );
    });
  });

  req.on('error', (err) => {
    getLogger().error(`${fileOffset+1} - ${fileOffset+events.length}: ${err.message}`);
    callback(null, fileOffset, events, configs);
  });

  req.write(postData);
  req.end();

  logBatchUploadStart(
    uploadSessionTag,
    {offset: fileOffset, size: events.length}
  );
};
