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

import type {
  MappingsType,
  InfoForNormalizationType,
  CustomTypeInfoType,
} from '../SignalsSchema/SignalsSchemaValidationTypes';

// List of all config options required for the app to be run.
// ConfigsBuilder reads values from 1) default values, 2) config file, and
// 3) command line arguments to build this.
export type FeedUploaderConfigs = {
  accessToken: string;
  batchSize: number;
  colMappingInfo: ColumnMappingInfo;
  columnMappingFilePath?: string,
  configFilePath?: string,
  dataSetId: string;
  fileDelimiter: string;
  fileHasHeader?: ?boolean;
  inputFilePath: string;
  testOnly?: boolean;
  uploadTag?: string;
  uploadTagPrefix: string;
  silent?: boolean;
  logging?: string;
};

// Type for handling data read from config flie or command line args
export type UserSuppliedConfigs = {
  accessToken?: string;
  columnMappingFilePath?: string;
  configFilePath?: string;
  dataSetId?: string;
  fileDelimiter?: string;
  inputFilePath?: string;
  testOnly?: boolean;
  uploadTag?: string;
  uploadTagPrefix?: string;
};

export type ColumnMappingInfo = {
  mapping: MappingsType;
  infoForNormalization?: InfoForNormalizationType;
  customTypeInfo?: CustomTypeInfoType;
};
