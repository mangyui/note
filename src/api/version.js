import request from '@/utils/request'

const MAPI = require('../../.private.js')

export function getVersion() {
  return request({
    url: MAPI.version.getVersion,
    method: 'get'
  })
}
