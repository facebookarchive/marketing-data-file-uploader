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

const https = require('https');
const querystring = require('querystring');

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
    if (configs.aws) {
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
  const options = {
    hostname: 'graph.facebook.com',
    port: 443,
    path: datasetEndpoint(configs),
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData),
    },
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
    if (configs.aws) {
      getLogger().error(JSON.stringify({
        Rows: `${fileOffset + 1} - ${fileOffset + events.length}`,
        err: err
      }));
    } else {
      getLogger().error(`${fileOffset + 1} - ${fileOffset + events.length}: ${err.message}`);
    }
    callback(null, fileOffset, events, configs);
  });

  req.write(postData);
  req.end();

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

  const options = {
    hostname: 'graph.facebook.com',
    port: 443,
    path: createCAEndpoint(configs.adAccountId),
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  const req = https.request(options, (res) => {
    getLogger().verbose(`statusCode: ${res.statusCode}`);
    getLogger().debug(`headers: ${JSON.stringify(res.headers)}`);

    res.setEncoding('utf8');
    res.on('data', (d) => {
      d = JSON.parse(d);
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
    });
  });

  req.on('error', (err) => {
    if (configs.aws) {
      getLoggerAWS().error(err.message);
    } else {
      getLogger().error(err.message);
    }
  });

  req.write(postData);
  req.end();
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
