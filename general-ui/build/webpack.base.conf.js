

const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const utils = require('./utils');
const config = require('../config');
const vueLoaderConfig = require('./vue-loader.conf');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  plugins: [
    ...(config.dev.useEslint ? [new ESLintPlugin({
      extensions: ['js', 'vue'],
      context: path.resolve(__dirname, '../'),
      files: ['src/**/*.{js,vue}', 'test/**/*.{js,vue}'],
      emitWarning: !config.dev.showEslintErrorsInOverlay,
      quiet: config.dev.setWarningQuiet === true,
    })] : []),
    new VueLoaderPlugin(),
  ],
  entry: {
    app: ['url-search-params-polyfill', './src/main.js'],
    login: './src/login.js',
    version: './src/version.js',
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath,
  },
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    'vue-i18n': 'VueI18n',
    'element-ui': 'ELEMENT',
    axios: 'axios',
    echarts: 'echarts',
    moment: 'moment',
    'common-modules-zj': 'CommonModules',
    xlsx: 'XLSX',
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.scss', '.html', '.svg'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    },
    fallback: {
      // prevent webpack from injecting mocks to Node native modules
      // that does not make sense for the client
      dgram: false,
      fs: false,
      net: false,
      tls: false,
      child_process: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: vueLoaderConfig,
          },
        ],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10000,
          },
        },
        generator: {
          filename: utils.assetsPath('img/[name].[hash:7][ext]'),
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10000,
          },
        },
        generator: {
          filename: utils.assetsPath('media/[name].[hash:7][ext]'),
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10000,
          },
        },
        generator: {
          filename: utils.assetsPath('fonts/[name].[hash:7][ext]'),
        },
      },
    ],
  },
};
