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

const CSV = require('csv-string');

const Normalizers = require('../SignalsSchema/SignalsBaseTypeNormalizers');
const Schema = require('../SignalsSchema/signalsEventDataSchema');
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
    Schema,
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
