/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

export const API_ERROR_SUBCODE_OVERLAPPED_PROGRESS = 2044011;

// Helper
const get = path => object =>
  path.reduce((xs, x) =>
    (xs && xs[x]) ? xs[x] : null, object);

export const getErrorSubcode = get(['error', 'error_subcode']);
