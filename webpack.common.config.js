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
      },
      {
        test: /\.css$/i,
        use: [
          // style-loader
          { loader: 'style-loader', options: { injectType: 'styleTag' } },
          // css-loader
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          // sass-loader
          { loader: 'sass-loader' }
        ]
      },
    ],
    
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ,'.css']
  },
  plugins: [
    //new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'nelson-boilerplate',
      template: 'index.template.html'
    }),
    
  ]
};