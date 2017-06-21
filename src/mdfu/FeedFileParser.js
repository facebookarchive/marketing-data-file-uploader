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

const normalizeSignal = require('../SignalsSchema/normalizeSignal');

import type { NormalizationResult }
  from '../SignalsSchema/SignalsSchemaValidationTypes';
import type { FeedUploaderConfigs } from './ConfigTypes';

import { MODE_OC, MODE_CA } from './FeedUploaderConstants';
import { UNSUPPORTED_MODE } from './ErrorTypes';

const CSV = require('csv-string');

const Normalizers = require('../SignalsSchema/SignalsBaseTypeNormalizers');
const OCSchema = require('../SignalsSchema/SignalsEventDataSchema');
const CASchema = require('../SignalsSchema/SignalsBasicPIISchema');
const SignalsUploaderUtils = require('../SignalsSchema/SignalsUploaderUtils');
const processPIISignalBeforeUpload =
  require('../SignalsSchema/processPIISignalBeforeUpload');

const Transformers = { processPIISignalBeforeUpload };
const { arrayToObject } = SignalsUploaderUtils;

export const parseAndNormalizeFeedLine = (
  line: string,
  configs: FeedUploaderConfigs,
): NormalizationResult => {

  return normalizeSignal(
    arrayToObject(parseLine(line, configs.fileDelimiter)),
    getSignalsSchema(configs.mode),
    Normalizers,
    Transformers,
    configs.colMappingInfo.mapping,
    configs.colMappingInfo.infoForNormalization,
    configs.colMappingInfo.customTypeInfo,
  );
};

const parseLine = (
  line: string,
  delimiter: string,
): Array<string> => {
  return CSV.parse(line, delimiter)[0];
};

const getSignalsSchema = (mode: string): Object => {
  let Schema = {};
  switch (mode) {
    case MODE_OC:
      Schema = OCSchema;
      break;
    case MODE_CA:
      Schema = CASchema;
      break;
    default:
      throw new Error(UNSUPPORTED_MODE);
  }
  return Schema;
};
