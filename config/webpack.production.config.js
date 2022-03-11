const path = require('path');

module.exports = {
  context: path.resolve(__dirname, '../src'),
  entry: './index.ts',
  mode: "production",
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../build'),
    library: 'modal.react.js',
    libraryTarget: "umd",
  },

  externals: {
    react: 'react',
    'react-dom': 'react-dom'
  },

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