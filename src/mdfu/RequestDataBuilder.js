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
  MODE_OC,
  MODE_CA,
} from './FeedUploaderConstants';

import { UNSUPPORTED_MODE } from './ErrorTypes';
import { getLogger } from './Logger';

import type { FeedUploaderConfigs } from './ConfigTypes';
import type { MappingsType } from '../SignalsSchema/SignalsSchemaValidationTypes';

const querystring = require('querystring');

export const buildPostRequestPayload = (
  events: Array<?Object>,
  caSchema: ?Array<string>,
  configs: FeedUploaderConfigs,
  uploadSessionTag: string,
  numEvents: number,
): string => {
  let postData = {
    'data': undefined,
    'payload': undefined,
    'access_token': configs.accessToken,
    'upload_tag': uploadSessionTag,
    'progress': undefined,
  };
  const validEvents = removeInvalidEvents(events, numEvents);

  switch (configs.mode) {
    case MODE_OC:
      postData.data = JSON.stringify(validEvents);
      if (!configs.uploadTag) {
        const progress = {
          'start_inclusive': numEvents - events.length,
          'end_exclusive': numEvents,
        };
        postData.progress = JSON.stringify(progress);
      }
      break;
    case MODE_CA:
      if(!caSchema) {
        throw Error('CA Schema is missing.');
      }
      postData.payload = buildCAPayload(validEvents, caSchema);
      break;
    default:
      throw new Error(UNSUPPORTED_MODE);
  }

  for (const key in postData) {
    if (!postData[key]) {
      delete postData[key];
    }
  }

  postData = querystring.stringify(postData);
  getLogger().silly(`postData: ${postData}`);
  return postData;
};

export const extractCASchema = (
  mapping: MappingsType,
): Array<string> => {
  const result = [];
  for (const index in mapping) {
    const i = Number(index);
    if (i !== NaN) {
      result[i] = mapping[index];
    }
  }
  return result.filter(x => x);
};

export const buildCAPayload = (
  records: Array<?Object>,
  schema: Array<string>,
): string => {
  // clean up schema
  // mirror the logic in processPIISignalBeforeUpload
  // this could have been done programmatically, but
  // scanning each records is not worth it
  const filteredSchema = [];
  schema.forEach(
    s => {
      switch (s) {
        case 'fn':
          filteredSchema.push(s);
          filteredSchema.push('fi');
          filteredSchema.push('f5first');
          break;
        case 'ln':
          filteredSchema.push(s);
          filteredSchema.push('f5last');
          break;
        case 'dob':
          filteredSchema.push('doby');
          filteredSchema.push('dobm');
          filteredSchema.push('dobd');
          break;
        case 'doby':
        case 'age':
          if (!filteredSchema.includes('doby')) {
            filteredSchema.push('doby');
          }
          break;
        default:
          filteredSchema.push(s);
          break;
      }
    },
  );

  // in events, multiple entries of the same type are grouped together
  // for ca upload, these need to be expanded into a flat array
  const lines = [];
  for (let i = 0; i < records.length; ++i) {
    if (records[i]) {
      const entries = [];
      for (let j = 0; j < filteredSchema.length; ++j) {
        let value = records[i][filteredSchema[j]];
        if (Array.isArray(value)) {
          value = value.shift() || '';
        } else if (value === undefined) {
          value = '';
        }
        entries.push(value);
      }
      lines.push(entries);
    }
  }

  const payload = {
    data: lines,
    schema: filteredSchema.map(s => s.toUpperCase()),
  };

  return JSON.stringify(payload);
};

export const removeInvalidEvents = (
  events: Array<?Object>,
  totalNumEvents: number,
): Array<?Object> => {
  const ommitedRows = _getNullElementIndices(events, totalNumEvents).join(',');
  if (ommitedRows.length > 0) {
    getLogger().warn(
      `Omitting invalid rows: ${_getNullElementIndices(events, totalNumEvents).join(',')}`
    );
  }
  return getValidEvents(events);
};

export const getValidEvents = (
  events: Array<?Object>,
): Array<?Object> => {
  return events.filter(_isValidEvent);
};

const _getNullElementIndices = (
  events: Array<?Object>,
  totalNumEvents: number,
): Array<string> => {

  return events.reduce(
    (indices, event, index) => {
      if (!_isValidEvent(event)) {
        indices.push(`${totalNumEvents - events.length + 1 + index}`);
      }
      return indices;
    },
    []
  );
};

const _isValidEvent = (
  event: ?Object,
): boolean => {
  return event !== null && event !== undefined;
};
