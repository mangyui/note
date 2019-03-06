import request from '@/utils/request'

export function getVersion() {
  return request({
    url: '/data/version/index.json',
    method: 'get'
  })
}
