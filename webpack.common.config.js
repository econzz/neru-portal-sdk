const path = require('path');

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, 'src/index.ts'),
  devtool: 'inline-source-map',
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  plugins: [
    //new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'nelson-boilerplate',
      template: 'index.template.html'
    }),
    new CopyPlugin([
      { from: 'assets', to: 'assets' },
      { from: 'lib', to: 'lib' },
    ])
  ]
};