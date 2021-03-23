const { merge } = require('webpack-merge')
const dev = require('./webpack.dev.js')
const drupal = require('./webpack.drupal.js')

module.exports = merge(dev,drupal)
