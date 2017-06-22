/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

import { getCaNameFromFilePath } from '../EventsUploader';

const NAME_REGEX = /^file_\d{4}-\d{2}-\d{2}$/;

describe('getCaNameFromFilePath', () => {
  it('should extract from Linux style file path correctly', () => {
    let name = getCaNameFromFilePath('/usr/temp/doc/file.csv');
    expect(name).toMatch(NAME_REGEX);

    name = getCaNameFromFilePath('usr/temp/doc/file.csv');
    expect(name).toMatch(NAME_REGEX);

    name = getCaNameFromFilePath('./usr/temp/doc/file.csv');
    expect(name).toMatch(NAME_REGEX);

    name = getCaNameFromFilePath('../usr/temp/doc/file.csv');
    expect(name).toMatch(NAME_REGEX);

    name = getCaNameFromFilePath('/usr/temp/doc/file.name.with.dots.csv');
    expect(name).toMatch(/^file.name.with.dots_\d{4}-\d{2}-\d{2}$/);
  });
});

describe('getCaNameFromFilePath', () => {
  it('should extract from Windows style file path correctly', () => {
    let name = getCaNameFromFilePath('C:\\Documents\\temp folder\\upload\\file.csv');
    expect(name).toMatch(NAME_REGEX);

    name = getCaNameFromFilePath('Documents\\temp folder\\upload\\file.csv');
    expect(name).toMatch(NAME_REGEX);

    name = getCaNameFromFilePath('.\\Documents\\temp folder\\upload\\file.csv');
    expect(name).toMatch(NAME_REGEX);

    name = getCaNameFromFilePath('..\\Documents\\temp folder\\upload\\file.csv');
    expect(name).toMatch(NAME_REGEX);

    name = getCaNameFromFilePath('C:\\Documents\\temp folder\\upload\\file.name.with.dots.csv');
    expect(name).toMatch(/^file.name.with.dots_\d{4}-\d{2}-\d{2}$/);
  });
});
