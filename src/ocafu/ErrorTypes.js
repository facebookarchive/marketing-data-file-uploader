/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @flow
 */

import { SUPPORTED_MODES } from './FeedUploaderConstants'

export const ERROR_NO_MODE =
  'Command is not specified. Avaialbe ones are:\n' +
  SUPPORTED_MODES.join('\n') + '\n\nExample:\n\n' +
  'marketing-data-file-uploader offline-conversions ' +
  '--columnMappingFilePath oca_column_mapping.json.example ' +
  '--configFilePath oca_file_uploader.conf.yml.example';
export const ERROR_CANNOT_PARSE_CONFIG_FILE =
  'Failed to parse the configuration file';
export const ERROR_REQUIRED_CONFIG_OPTION_MISSING =
  'required config option not provided';
export const ERROR_REQUIRED_CONFIG_VALUE_INVALID =
  'config value provided is invalid';
export const ERROR_UNKNOWN_CONFIG_OPTION =
  'Unknown config option';
export const ERROR_SAMPLE_MATCH_RATE_TOO_LOW =
  'Match rate for sampled events is too low\n' +
  'Please fix column mapping settings before trying again\n' +
  'For additional information, please visit http://someurl.com';
export const ERROR_SAMPLE_NORMALIZATION_ERRORS =
  'Too many issues found in the sampled set of events';
