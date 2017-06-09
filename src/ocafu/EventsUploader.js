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
      `Posting rows ${getBatchSigStr({offset: fileOffset, size: events.length})} to \
${datasetEndpoint(configs.dataSetId)}/events`
    );
    _postEvents(events, fileOffset, configs, uploadSessionTag, callback);
  } else {
    getLogger().info('Silent Mode');
    callback(null, fileOffset, events);
  }
};

export const batchUploadCallback = (
  err: Error,
  fileOffset: number,
  events: Array<Object>,
): void => {
  if (err === null) {
    getLogger().info(
      `Rows ${getBatchSigStr({offset: fileOffset, size: events.length})} - ` +
      `Successfully uploaded ${_getValidEvents(events).length} events.`
    );
  } else {
    getLogger().error(
      `Rows ${getBatchSigStr({offset: fileOffset, size: events.length})} ` +
      `- Error uploading ${_getValidEvents(events).length} events: ` +
      err.message
    );
  }
};

export type batchUploadCallbackType = (
  err: ?Error,
  fileOffset: number,
  events: Array<Object>,
) => void;

const _postEvents = (
  events: Array<Object>,
  fileOffset: number,
  configs: FeedUploaderConfigs,
  uploadSessionTag: string,
  callback: batchUploadCallbackType,
): void => {
  const validEvents = _removeInvalidEvents(events, fileOffset);
  const postData = querystring.stringify({
    'data' : JSON.stringify(validEvents),
    'access_token': configs.accessToken,
    'upload_tag': uploadSessionTag,
  });

  getLogger().silly(`postData: ${postData}`);

  const options = {
    hostname: 'graph.facebook.com',
    port: 443,
    path: `${datasetEndpoint(configs.dataSetId)}/events`,
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
      );
    });
  });

  req.on('error', (err) => {
    getLogger().error(`${fileOffset+1} - ${fileOffset+events.length}: ${err.message}`);
    callback(null, fileOffset, events);
  });

  req.write(postData);
  req.end();

  logBatchUploadStart(
    uploadSessionTag,
    {offset: fileOffset, size: events.length}
  );
};

const _removeInvalidEvents = (
  events: Array<Object>,
  fileOffset, number,
): Array<Object> => {
  const ommitedRows = _getNullElementOffsets(events, fileOffset).join(',');
  if (ommitedRows.length > 0) {
    getLogger().warn(
      `Omitting invalid rows: ${_getNullElementOffsets(events, fileOffset).join(',')}`
    );
  }
  return _getValidEvents(events);
};

const _getValidEvents = (
  events: Array<Object>,
): Array<Object> => {
  return events.filter(_isValidEvent);
};

const _getNullElementOffsets = (
  events: Array<Object>,
  fileOffset, number,
): Array<string> => {
  return events.reduce(
    (offsets, event, index) => {
      if (!_isValidEvent(event)) {
        offsets.push(`${fileOffset + 1 + index}`);
      }
      return offsets;
    },
    []
  );
};

const _isValidEvent = (
  event: Object,
): boolean => {
  return event !== null;
};
