const { merge } = require('webpack-merge')
const prod = require('./webpack.prod.js')
const drupal = require('./webpack.drupal.js')

module.exports = merge(prod,drupal)
