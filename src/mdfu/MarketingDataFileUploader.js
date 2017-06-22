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
 import {
   MODE_ROW_NAMES,
   MODE_CA,
   MODE_OC,
   MODE_VER,
 } from './FeedUploaderConstants';
 import { version } from '../../package.json';
 import { UNSUPPORTED_MODE } from './ErrorTypes';
 import { createCustomAudience } from './EventsUploader';

 import type { uploadCallback } from './EventsUploader';

 const winston = require('winston');

 winston.level = process.env.MDFU_LOG_LEVEL || 'info';

 export const upload = (): void => {
   const {configs, err} = buildConfigs();
   if (err) {
     winston.level = 'error';
     initializeLogger().error(err.message);
     process.exit();
   }
   if (configs) {
     switch (configs.mode) {
       case MODE_CA:
       case MODE_OC:
        {
           winston.level = configs.logging;
           initializeLogger();
           testSampledEvents(configs, (err: ?Error) => {
             const rowName = MODE_ROW_NAMES[configs.mode];
             if (err) {
               getLogger().error(err.message);
             } else if (configs.testOnly) {
               getLogger().info(`Sampled ${rowName} set passed the test.`);
             } else if (configs.mode === MODE_CA && !configs.customAudienceId) {
               createCustomAudience(configs, _uploadCallback);
             } else {
               _uploadCallback(configs);
             }
           });
        }
        break;
      case MODE_VER:
        console.log(`v${version}`);
        break;
      default:
        throw new Error(UNSUPPORTED_MODE);
     }
   }
 };

 const _uploadCallback: uploadCallback = (configs) => {
   const rowName = MODE_ROW_NAMES[configs.mode];
   getLogger().info(`Sampled ${rowName} look ok.`);
   getLogger().info(`STEP 2. Uploading the ${rowName}`);
   parseAndNormalizeFeedFile(configs);
 };
