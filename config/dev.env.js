'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"api"',
  // BASE_API: '"http://192.168.43.120/soQ/api/public/"',
})
