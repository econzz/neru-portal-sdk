const merge = require('webpack-merge') // webpack-merge
const common = require('./webpack.common.config.js') // 汎用設定をインポート
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// common設定とマージする
module.exports = merge(common, {
  mode: 'production', // 本番モード
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist/live/')
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  },
  performance: { hints: false }
});