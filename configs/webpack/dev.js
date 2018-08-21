// development config
const merge = require('webpack-merge');
const webpack = require('webpack');
const commonConfig = require('./common');

module.exports = merge(commonConfig, {
  entry: [
    'whatwg-fetch',
    'react-hot-loader/patch', // activate HMR for React
    'webpack-dev-server/client?http://0.0.0.0:3000',// bundle the client for webpack-dev-server and connect to the provided endpoint
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
            test: /\.(jpg|jpeg|png|svg)$/i,
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
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
        "API_URL": JSON.stringify("https://backend-alpha.trendnine.com")
    })
  ],
});
