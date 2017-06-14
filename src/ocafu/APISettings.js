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

const GRAPH_API_BASE_URL = 'https://graph.facebook.com';
import {
  MARKETING_API_VER,
  MODE_CA,
  MODE_OC,
} from './FeedUploaderConstants';

export const datasetEndpoint = (
  dataSetId: string,
  mode: string,
): string => {
  let edge = 'events';
  switch (mode) {
    case MODE_CA:
      edge = 'users';
      break;
    case MODE_OC:
    default:
      break;
  }
  return `${GRAPH_API_BASE_URL}/v${MARKETING_API_VER}/${dataSetId}/${edge}`;
};
