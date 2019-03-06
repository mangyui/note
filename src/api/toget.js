import request from '@/utils/request'

export function getFriendList() {
  return request({
    url: '/data/friends/followee.json',
    method: 'get'
  })
}
// 首页推荐
export function getRecommend() {
  return request({
    url: '/api/public/?s=User.getRecommend&uid=1',
    method: 'get'
  })
}

export function QuesDetails(data) {
  return request({
    url: 'api/public/?service=App.Question_CURD.GetById',
    method: 'get',
    params: {
      Id: data
    }
  })
}

