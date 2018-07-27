// production config
const merge = require('webpack-merge');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {resolve} = require('path');

const commonConfig = require('./common');

module.exports = merge(commonConfig, {
  entry: ['whatwg-fetch', './index.tsx'],
  output: {
    filename: 'js/bundle.[hash].min.js',
    path: resolve(__dirname, '../../dist'),
    publicPath: '/',
  },
  module: {
      rules: [
            {
                test: /\.(jpg|jpeg|png|svg)$/i,
                loaders: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]'
                        }
                    }
                ]
            }
      ]
  },
  plugins: [
    new webpack.DefinePlugin({
        "API_URL": JSON.stringify("https://api.trendnine.com")
    }),
    new CopyWebpackPlugin([{ from: "src/assets", to: "dist" }])
  ],
});
