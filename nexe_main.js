/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 */

// This is the entry point for the app using the transpiled modules in build
const ocafu = require('./lib/ocafu/OfflineConversionsFeedUploader');
ocafu.uploadConversionsFeed();
