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

import {
  datasetEndpoint,
  createCAEndpoint,
} from './APISettings';
import type {FeedUploaderConfigs} from './ConfigTypes';
import {getBatchSigStr, logBatchUploadStart, logBatchUploadEnd} from './UploadSession';
import {
  MODE_ROW_NAMES,
  MODE_CA,
  MODE_OC,
} from './FeedUploaderConstants';
import {getLogger, getLoggerAWS} from './Logger';
import {getValidEvents} from './RequestDataBuilder';
import {
  UNSUPPORTED_MODE,
  ERROR_NO_CA_ID_OR_ACT_ID,
} from './ErrorTypes';

const querystring = require('querystring');
const request = require('requestretry');
const APIErrorTypes = require('./APIErrorTypes');

const MAX_RETRIES = 10;   // Retry 10 times.
const RETRY_DELAY = 5000; // Wait 5s before trying again.
const RETRY_STRATEGY = request.RetryStrategies.HTTPOrNetworkError; // retry on 5xx or network errors.

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
${datasetEndpoint(configs)}`
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
    const error_subcode = APIErrorTypes.getErrorSubcode(JSON.parse(err.message));
    if(error_subcode === APIErrorTypes.API_ERROR_SUBCODE_OVERLAPPED_PROGRESS) {
      getLogger().info(
        `Rows ${getBatchSigStr({offset: fileOffset, size: events.length})} ` +
        `were previously uploaded.`
        );
    } else if (configs.aws) {
      getLoggerAWS().error(JSON.stringify({
        Rows: `${getBatchSigStr({offset: fileOffset, size: events.length})}`,
        rowName: `${rowName}`,
        err: err.message
      }));
    } else {
      getLogger().error(
        `Rows ${getBatchSigStr({offset: fileOffset, size: events.length})} ` +
        `- Error uploading ${getValidEvents(events).length} ${rowName}: ` +
        err.message
      );
    }
  }
};

export type batchUploadCallbackType = (
  err: ?Error,
  fileOffset: number,
  events: Array<Object>,
  configs: FeedUploaderConfigs,
) => void;

const _postEvents = (
  events: Array<Object>,
  postData: string,
  fileOffset: number,
  configs: FeedUploaderConfigs,
  uploadSessionTag: string,
  callback: batchUploadCallbackType,
): void => {
  request({
    url: datasetEndpoint(configs),
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData),
    },
    body: postData,
    fullResponse: true, // full response object not just the body.
    maxAttempts: MAX_RETRIES,
    retryDelay: RETRY_DELAY,
    retryStrategy: RETRY_STRATEGY
  })
  .then(function (res) {
    getLogger().verbose(`statusCode: ${res.statusCode}`);
    getLogger().debug(`headers: ${JSON.stringify(res.headers)}`);

    logBatchUploadEnd(
      uploadSessionTag,
      {offset: fileOffset, size: events.length},
    );
    callback(
      res.statusCode === 200 ? null : new Error(res.body),
      fileOffset,
      events,
      configs,
    );
  })
  .catch(function(err) {
    callback(err, fileOffset, events, configs);
  });

  logBatchUploadStart(
    uploadSessionTag,
    {offset: fileOffset, size: events.length}
  );
};

export type uploadCallback = (
  configs: FeedUploaderConfigs,
) => void;

export const createCustomAudience = (
  configs: FeedUploaderConfigs,
  callback: uploadCallback,
): void => {
  // sanity check
  if (configs.mode !== MODE_CA) {
    callback(configs);
    return;
  }

  if (configs.customAudienceId) {
    callback(configs); // already has the id... just proceed
    return;
  }

  if (!configs.adAccountId) {
    if (configs.aws) {
      getLoggerAWS().error(ERROR_NO_CA_ID_OR_ACT_ID);
    } else {
      getLogger().error(ERROR_NO_CA_ID_OR_ACT_ID.description);
    }
    return;
  }

  let postData = {
    name: getCaNameFromFilePath(configs.inputFilePath),
    subtype: 'CUSTOM',
    access_token: configs.accessToken,
  };

  getLogger().info(`Creating a new custom audience (name: ${postData.name}) ...`);

  postData = querystring.stringify(postData);
  getLogger().silly(`postData: ${postData}`);

  request({
    url: createCAEndpoint(configs),
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData),
    },
    body: postData,
    fullResponse: true, // full response object not just the body.
    maxAttempts: MAX_RETRIES,
    retryDelay: RETRY_DELAY,
    retryStrategy: RETRY_STRATEGY
  })
  .then(function (res) {
    getLogger().verbose(`statusCode: ${res.statusCode}`);
    getLogger().debug(`headers: ${JSON.stringify(res.headers)}`);

    const d = JSON.parse(res.body);
    if (d.error) {
      if (configs.aws) {
       getLoggerAWS().error(JSON.stringify({failedAPIRes: `${JSON.stringify(d.error)}`}));
      } else {
       getLogger().error(`Custom audience creation failed. API responded:\n${JSON.stringify(d.error)}`);
      }
    } else if (d.id) {
     getLogger().info(`Created a new custom audience (id: ${d.id})`);
     configs.customAudienceId = d.id;
     callback(configs);
    } else {
      if (configs.aws) {
       getLoggerAWS().error(JSON.stringify({unknownErrRes: `${JSON.stringify(d)}`}))
      } else {
       getLogger().error(`Unknown error when creating custom audience. Response: ${JSON.stringify(d)}`);
      }
    }
  })
  .catch(function(err) {
    if (configs.aws) {
      getLoggerAWS().error(err.message);
    } else {
      getLogger().error(err.message);
    }
  });
};

export const getCaNameFromFilePath = (
  path: string,
): string => {
  // append today's date at the end
  const date = new Date();
  const dateString = '_' + date.toISOString().slice(0, 10);
  // extract file name and remove extension (the last .something)
  return path.replace(/^.*[\\\/]/, '').replace(/\.[^\.]+$/, '') + dateString;
};
