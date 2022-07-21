const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  context: path.resolve(__dirname, '../examples'),
  entry: './index.tsx',
  mode: "development",
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../build'),
  },

  devServer: {
    static: {
      directory: path.join(__dirname, 'build'),
    },
    compress: true,
    port: 9000,
  },

  plugins: [
    new HtmlWebpackPlugin()
  ],

  optimization: {
    minimize: false
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
    ]
  }
};