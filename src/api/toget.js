import request from '@/utils/request'

export function getFriendList() {
  return request({
    url: '/data/friends/followee.json',
    method: 'get'
  })
}

// 验证码
export function getVCode() {
  return request({
    url: 'http://192.168.1.106:8080/?s=user.getCode',
    method: 'get'
  })
}

// 学校列表
export function getSchoolList() {
  return request({
    url: '/api/public/?service=App.School.GetAll',
    method: 'get'
  })
}

// 首页推荐
export function getRecommend() {
  return request({
    url: '/api/public/?s=User.getRecommend',
    method: 'get',
    params: {
      uid: 1
    }
  })
}

// 错题分类
export function questionCategory() {
  return request({
    url: '/api/public/?service=App.QCategory.Getcates',
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

