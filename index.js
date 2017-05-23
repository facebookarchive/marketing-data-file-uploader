const ocafu = require('./lib/ocafu/OfflineConversionsFeedUploader');

exports.uploadConversionsFeed = function() {
  ocafu.uploadConversionsFeed();
};
