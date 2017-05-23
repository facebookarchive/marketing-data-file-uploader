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

 import { buildConfigs } from './ConfigsBuilder';
 import { getLogger, initializeLogger } from './Logger';
 import { parseAndNormalizeFeedFile } from './FeedFileHandler';
 import { testSampledEvents } from './SampledEventsTester';

 const winston = require('winston');

 winston.level = process.env.OCAFU_LOG_LEVEL || 'info';

 export const uploadConversionsFeed = (): void => {
   const {configs, err} = buildConfigs();
   if (err) {
     winston.level = 'error';
     initializeLogger().error(err.message);
     process.exit();
   }
   if (configs) {
     winston.level = configs.logging;
     initializeLogger();
     testSampledEvents(configs, (err: ?Error) => {
       if (err) {
         getLogger().error(err.message);
       } else if (configs.testOnly) {
         getLogger().info('Sampled events set passed the test.');
       } else {
         getLogger().info('Sampled events look ok.');
         getLogger().info('STEP 2. Uploading the events');
         parseAndNormalizeFeedFile(configs);
       }
     });
   }
 };
