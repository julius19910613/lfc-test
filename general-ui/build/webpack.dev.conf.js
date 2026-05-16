

const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const { merge } = require('webpack-merge');
const path = require('path');
const baseWebpackConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);
const commonModulesPath = path.dirname(require.resolve('common-modules-zj/package.json'));

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true }),
  },
  // eval-cheap-module-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    client: {
      logging: 'warn',
      overlay: config.dev.errorOverlay
        ? { warnings: false, errors: true }
        : false,
    },
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || 'auto',
    open: config.dev.autoOpenBrowser,
    static: false, // since we use CopyWebpackPlugin.
    proxy: config.dev.proxyTable,
    devMiddleware: {
      publicPath: config.dev.assetsPublicPath,
      stats: 'errors-warnings',
    },
    watchFiles: {
      options: {
        poll: config.dev.poll,
      },
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // new BundleAnalyzerPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'version.html',
      chunks: ['chunk-vendors', 'app'],
      inject: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'login.html',
      template: 'version.html',
      chunks: ['chunk-vendors', 'login'],
      inject: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'version.html',
      template: 'version.html',
      chunks: ['chunk-vendors', 'version'],
      inject: true,
    }),
    // copy custom static assets
    new CopyWebpackPlugin({
      patterns: [
        {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
          globOptions: {
            ignore: ['**/.*'],
          },
        },
        {
          from: path.resolve(commonModulesPath, 'src/assets/styles/iconfont'),
          to: 'common_resources/emotibot/icons/iconfont',
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(commonModulesPath, 'src/assets/styles/coloricon'),
          to: 'common_resources/emotibot/icons/coloricon',
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(commonModulesPath, 'src/assets/images/favicon.png'),
          to: 'common_resources/emotibot/images/favicon.png',
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          chunks: 'all',
          test(module) {
            return (
              module.resource &&
              /\.js$/.test(module.resource) &&
              module.resource.indexOf(
                path.join(__dirname, '../node_modules'),
              ) === 0
            );
          },
          enforce: true,
        },
      },
    },
  },
});

devWebpackConfig.externals = {};

module.exports = devWebpackConfig;
