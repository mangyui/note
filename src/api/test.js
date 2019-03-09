import request from '@/utils/request'

export function getHello() {
  return request({
    url: '/public/?s=Question_CURD.get',
    method: 'get'
  })
}
