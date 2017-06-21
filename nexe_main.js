/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 */

// This is the entry point for the app using the transpiled modules in build
const mdfu = require('./lib/mdfu/MarketingDataFileUploader');
mdfu.upload();
