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

export const getAvailableHTTPSOptions = (): Array<string> => {
  return [
    'ca',
    'cert',
    'ciphers',
    'key',
    'pfx',
    'passphrase',
    'rejectUnauthorized',
    'secureProtocol',
    'servername',
  ];
};

export type HTTPSOptions = {
  pfx?: string,
  key?: string,
  passphrase?: string,
  cert?: string,
  ca?: string,
  ciphers?: string,
  rejectUnauthorized?: boolean,
  secureProtocol?: string,
  servername?: string,
};
