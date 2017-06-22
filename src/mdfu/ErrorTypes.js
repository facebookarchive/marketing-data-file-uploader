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
export const UNSUPPORTED_MODE =
  'Operation is unsupported in the current mode.' +
  ' This is likely due to a bug in the tool.';
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
export const ERROR_NO_CA_ID_OR_ACT_ID =
  'To upload a custom audience, either a custom audience id (for updating) ' +
  'or an ad account id (for creating) is required'; 
