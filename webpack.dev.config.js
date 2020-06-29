const merge = require('webpack-merge') // webpack-merge
const common = require('./webpack.common.config.js') // 汎用設定をインポート
const path = require('path');

// common設定とマージする
module.exports = merge(common, {
  mode: 'development', // 開発モード
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist/dev/')
  },
  devtool: 'inline-source-map', // 開発用ソースマップ,
  devServer: {
    contentBase: path.resolve(__dirname, './dist/dev/'),
    compress: true,
    host: '127.0.0.1',
    port: 9100,
    open: true,
    inline:true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: true,
      ignored: /node_modules/
    }
  },
  
});