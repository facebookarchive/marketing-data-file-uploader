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

'use strict';

export type SignalsNormalizationErrorLevelType = "reject" | "warning";
export type SignalsNormalizationErrorScopeType = "rule" | "prop";
export type SignalsNormalizationPropErrorType = "invalid" | "too-many" | "some-invalid";

export type CustomTypeDefinition = {
  baseType: string,
  path: string,
  key: string,
}

export type RuleSpecs = {
  rule: string,
  warnOnFail?: boolean,
  name?: string,
  args?: any,
}

export type SignalsSchemaSummary = {
  id: ?string,
  additionalInfoURL?: string,
  allSimplePropKeysInSchema: Array<string>,
  noUISimplePropKeysInSchema: Array<string>,
  exampleFiles?: Object,
  extraPropsCollectors: Array<string>,
  keysForSimplePropsTypesInSchema: Object,
  pathForSimplePropKeys: Object,
  schemasForSimplePropsInSchema: Object,
  typesForSimplePropKeys: Object,
  typesForSimplePropPaths: Object,
  keysForSimplePropPaths: Object,
  keysForSubschemasWithID: Object,
  piiKeys: Array<string>,
  subschemasByType: Object,
  validIf: ?RuleSpecs,
}

export type NormalizationError = {
  level: SignalsNormalizationErrorLevelType,
  where: SignalsNormalizationErrorScopeType,
  propError?: ?{
    error: SignalsNormalizationPropErrorType,
    badValues: Array<{
      value: any,
      // Position of value (i.e. column index) before remap.
      rawPosition?: (number | string),
    }>,
  },
  ruleError?: ?{
    ruleSpecs: RuleSpecs,
    details: any,
  },
}

export type NormalizationTree = {
  type: 'compound' | 'prop',
  nodes?: Object,
  propSchema: Object,
  errors: Array<NormalizationError>,

  rawValue?: Object | any,
  normalizedValue?: Object | any,

  infoForNormalization?: Object | any,
  reverseMapping?: Object | any,
}

export type NormalizationResult = {
  tree: ?NormalizationTree,

  normalizedValue: ?Object,
  valid: boolean,
  fatalError: ?Error,

  invalidProps: Array<string>,
  missingRequiredProps: Array<string>,
  notFoundProps: Array<string>,
  unidentifiedProps: Array<string>,
  notAllowedProps: Array<string>,
}

export type SignalType = Object | any;

export type SignalsPropSchema = {
  examples?: string | Array<mixed>,
  formats?: Array<mixed>,
  key?: string,
  label?: string,
  maxOccurrence?: number,
  type: SignalsSchema | string,
  typeParams?: mixed,
}

export type SignalsSchema = {
  additionalInfoURL?: string,
  baseSchema?: {id: string, version?: string},
  exampleFiles?: {[key: string]: string},
  id?: string,
  props?: Array<SignalsPropSchema>,
  type?: string,
  validIf?: RuleSpecs,
  version?: string,
}

export type NormalizerType = (
  input: ?mixed,
  params: {[key: string]: mixed},
  additionalInfo?: ?mixed,
) => ?mixed;

export type NormalizersType = {
  [key: string]: NormalizerType,
}

export type MappingsType = {
  [key: string]: string
}

export type ReverseMappingsType = {
  [key: string]: ReverseMappingsType,
}

export type InfoForNormalizationType = {
  [key: string]: mixed
}

export type CustomTypeInfoType = {
  [key: string]: {
    baseType: string,
    typeParams?: mixed,
    maxOccurrence?: number,
  }
}

export type TransformersType = {
  [key: string]: (
    normalizedValue: Object,
    typeSchema: SignalsPropSchema,
  ) => ?mixed
}
