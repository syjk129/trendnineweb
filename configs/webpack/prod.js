// production config
const merge = require('webpack-merge');
const {resolve} = require('path');

const commonConfig = require('./common');

module.exports = merge(commonConfig, {
  entry: './index.tsx',
  output: {
    filename: 'js/bundle.[hash].min.js',
    path: resolve(__dirname, '../../dist'),
    publicPath: '/',
  },
  devtool: 'source-map',
  module: {
      rules: [
            {
                test: /\.(jpg|png|svg)$/i,
                loaders: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[hash].[ext]'
                        }
                    }
                ]
            }
      ]
  },
  plugins: [],
});
