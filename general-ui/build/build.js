'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

const spinner = ora('building for production...')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err

    // Output errors first so they are visible even if warnings truncate the log
    const statsJson = stats.toJson({
      all: false,
      errors: true,
      errorDetails: true,
      warnings: false
    })
    if (statsJson.errors && statsJson.errors.length) {
      console.log(chalk.red('\n=== BUILD ERRORS ===\n'))
      statsJson.errors.forEach((e, i) => {
        console.log(chalk.red(`Error ${i + 1}:`))
        console.log(e.message || e.stack || String(e))
        console.log()
      })
    }

    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
