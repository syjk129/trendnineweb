// development config
const merge = require('webpack-merge');
const webpack = require('webpack');
const commonConfig = require('./common');

module.exports = merge(commonConfig, {
  entry: [
    'react-hot-loader/patch', // activate HMR for React
    'webpack-dev-server/client?http://localhost:3000',// bundle the client for webpack-dev-server and connect to the provided endpoint
    'webpack/hot/only-dev-server', // bundle the client for hot reloading, only- means to only hot reload for successful updates
    './index.tsx' // the entry point of our app
  ],
  devServer: {
    historyApiFallback: true,
    port: "3000",
    hot: true,
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
      rules: [
          {
            test: /\.(png|jpg|jpeg|svg)$/i,
            loaders: [
                {
                    loader: 'url-loader',
                    options: {
                        name: '[path][name].[hash].[ext]',
                        limit: 10000
                    }
                }
            ]
          }
      ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
});
