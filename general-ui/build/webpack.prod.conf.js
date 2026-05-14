

const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// // const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : require('../config/prod.env');

const webpackConfig = merge(baseWebpackConfig, {
  mode: process.env.NODE_ENV === 'testing' ? 'development' : 'production',
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true,
    }),
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[contenthash].js'),
    chunkFilename: utils.assetsPath('chunks/[name].[contenthash].js'),
    // chunkFilename: '[name].chunk.js',
    clean: false,
  },
  optimization: {
    moduleIds: 'deterministic',
    concatenateModules: true,
    runtimeChunk: {
      name: 'manifest',
    },
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'vendor',
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
        'vendor-async': {
          name: 'vendor-async',
          chunks: 'async',
          minChunks: 2,
          priority: 5,
        },
        'used-twice': {
          name: 'used-twice',
          chunks: 'async',
          minChunks: 2,
          priority: 4,
          reuseExistingChunk: true,
        },
      },
    },
    minimizer: [
      '...',
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: ['default', config.build.productionSourceMap
            ? { discardComments: { removeAll: true } }
            : {}],
        },
      }),
    ],
  },
  plugins: [
    // new BundleAnalyzerPlugin({ analyzerPort: 8889 }),
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env,
    }),
    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : config.build.index,
      template: 'index.html',
      chunks: ['vendor', 'manifest', 'app'],
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
    }),
    new HtmlWebpackPlugin({
      filename: 'login.html',
      template: 'login.html',
      chunks: ['vendor', 'manifest', 'login'],
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
    }),
    // new HtmlWebpackPlugin({
    //   filename: 'version.html',
    //   template: 'version.html',
    //   chunks: ['vendor', 'manifest', 'version'],
    //   inject: true,
    //   minify: {
    //     removeComments: true,
    //     collapseWhitespace: true,
    //     removeAttributeQuotes: true,
    //     // more options:
    //     // https://github.com/kangax/html-minifier#options-quick-reference
    //   },
    // }),
    // copy custom static assets
    new CopyWebpackPlugin({
      patterns: [
        {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
          globOptions: {
            ignore: ['**/.*'],
          },
        },
      ],
    }),
  ],
});

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin');

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      algorithm: 'gzip',
      filename: '[path][base].gz',
      test: new RegExp(
        `\\.(${
        config.build.productionGzipExtensions.join('|')
        })$`,
      ),
      threshold: 10240,
      minRatio: 0.8,
    }),
  );
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
