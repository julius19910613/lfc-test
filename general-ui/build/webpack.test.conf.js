'use strict'
// This is the webpack config used for unit tests.

const webpack = require('webpack')
const { merge } = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

const webpackConfig = merge(baseWebpackConfig, {
  // use inline sourcemap for karma-sourcemap-loader
  module: {
    // No style rules needed for unit tests - vue-loader v15 pitcher handles
    // .vue style blocks; adding style rules causes vue-style-loader conflicts
  },
  devtool: 'inline-source-map',
  resolveLoader: {
    alias: {
      // necessary to to make lang="scss" work in test when using vue-loader's ?inject option
      // see discussion at https://github.com/vuejs/vue-loader/issues/724
      'scss-loader': 'sass-loader'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/test.env')
    })
  ]
})

// no need for app entry during tests
delete webpackConfig.entry
webpackConfig.externals = {}

module.exports = webpackConfig
