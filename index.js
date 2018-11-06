// Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved

const mdfu = require('./lib/mdfu/MarketingDataFileUploader');

exports.upload = function() {
  mdfu.upload();
};
