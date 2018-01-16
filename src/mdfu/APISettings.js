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

const getApiVersion = (
  configs: FeedUploaderConfigs
): string => {
  return configs.apiVersion ? configs.apiVersion : MARKETING_API_VER;
};

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
  return `${GRAPH_API_BASE_URL}/v${getApiVersion(configs)}/${id}/${edge}`;
};

export const createCAEndpoint = (
  configs: FeedUploaderConfigs,
): string => {
  let id = configs.adAccountId;
  // make sure ad account id has the 'act_' prefix
  if (!id.match(/act_\d+/)) {
    id = 'act_' + id;
  }
  return `${GRAPH_API_BASE_URL}/v${getApiVersion(configs)}/${id}/customaudiences`;
}
