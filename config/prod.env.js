'use strict'

const MAPI = require('../.private.js')

module.exports = {
  NODE_ENV: '"production"',
  // BASE_API: '"http://192.168.43.120"',
  BASE_API: MAPI.api.baseurl,
}
