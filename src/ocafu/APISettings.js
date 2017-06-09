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

export const datasetEndpoint = (
  dataSetId: string,
  apiVer: string,
): string => {
  return `${GRAPH_API_BASE_URL}/v${apiVer}/${dataSetId}`;
};
