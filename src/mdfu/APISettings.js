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
import { UNSUPPORTED_MODE } from './ErrorTypes';

import type { FeedUploaderConfigs } from './ConfigTypes';

export const datasetEndpoint = (
  configs: FeedUploaderConfigs,
): string => {
  let id, edge;
  switch (configs.mode) {
    case MODE_CA:
      id = configs.customAudienceId;
      edge = 'users';
      break;
    case MODE_OC:
      id = configs.dataSetId;
      edge = 'events';
      break;
    default:
      throw new Error(UNSUPPORTED_MODE.description);
  }
  return `${GRAPH_API_BASE_URL}/v${MARKETING_API_VER}/${id}/${edge}`;
};

export const createCAEndpoint = (
  adAccountId: string,
): string => {
  // make sure ad account id has the 'act_' prefix
  if (!adAccountId.match(/act_\d+/)) {
    adAccountId = 'act_' + adAccountId;
  }
  return `${GRAPH_API_BASE_URL}/v${MARKETING_API_VER}/${adAccountId}/customaudiences`;
}
