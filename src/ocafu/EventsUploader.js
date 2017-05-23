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
import type { EventBatchSignature } from './UploadSession';
import { getBatchSigStr, logBatchUploadStart, logBatchUploadEnd } from './UploadSession';
import { getLogger } from './Logger';

const querystring = require('querystring');
const https = require('https');

export const uploadEventsBatch = (
  events: Array<Object>,
  uploadSessionTag: string,
  fileOffset: number,
  configs: FeedUploaderConfigs,
  callback: batchUploadCallbackType,
): void => {
  // Do the real uploading (calling into graph API) if not silent.
  if (configs.silent !== true) {
    getLogger().info(
      `Posting events ${getBatchSigStr({offset: fileOffset, size: events.length})} to \
${datasetEndpoint(configs.dataSetId, configs.apiVer)}/events`
    );
    _postEvents(events, fileOffset, configs, uploadSessionTag, callback);
  } else {
    getLogger().info('Silent Mode');
    callback(null, {offset: fileOffset, size: events.length});
  }
};

export const batchUploadCallback = (
  err: Error,
  batchInfo: EventBatchSignature,
): void => {
  if (err === null) {
    getLogger().info(`Rows ${getBatchSigStr(batchInfo)} - Successfully uploaded ${batchInfo.size} events.`);
  } else {
    getLogger().error(`Rows ${getBatchSigStr(batchInfo)} - Error uploading ${batchInfo.size} events: ` +
      err.message);
  }
};

export type batchUploadCallbackType = (
  err: ?Error,
  batchInfo: EventBatchSignature,
) => void;

const _postEvents = (
  events: Array<Object>,
  fileOffset: number,
  configs: FeedUploaderConfigs,
  uploadSessionTag: string,
  callback: batchUploadCallbackType,
): void => {
  const postData = querystring.stringify({
    'data' : JSON.stringify(events),
    'access_token': configs.accessToken,
    'upload_tag': uploadSessionTag,
  });

  getLogger().silly(`postData: ${postData}`);

  const options = {
    hostname: 'graph.facebook.com',
    port: 443,
    path: `${datasetEndpoint(configs.dataSetId, configs.apiVer)}/events`,
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
        {offset: fileOffset, size: events.length},
      );
    });
  });

  req.on('error', (err) => {
    getLogger().error(`${fileOffset+1} - ${fileOffset+events.length}: ${err.message}`);
    callback(null, {offset: fileOffset, size: events.length});
  });

  req.write(postData);
  req.end();

  logBatchUploadStart(
    uploadSessionTag,
    {offset: fileOffset, size: events.length}
  );
};
