import request from '@/utils/request'

export function getHello() {
  return request({
    url: '/api/public/?s=Question_CURD.get',
    method: 'get'
  })
}
