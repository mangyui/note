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
    url: '/?s=user.getCode',
    method: 'get'
  })
}

// 学校列表
export function getSchoolList() {
  return request({
    url: '/?service=App.School.GetAll',
    method: 'get'
  })
}

// 首页推荐
export function getRecommend(uid) {
  return request({
    url: '/?s=User.getRecommend',
    method: 'get',
    params: {
      uid
    }
  })
}

// 错题分类
export function questionCategory() {
  return request({
    url: '/?service=App.QCategory.Getcates',
    method: 'get'
  })
}

// 题目详情
export function QuesDetails(data) {
  return request({
    url: '/?service=App.Question.GetById',
    method: 'get',
    params: data
  })
}

// 题目详情
export function MistakeDetails(data) {
  return request({
    url: '/?service=App.Mistake.GetMistake',
    method: 'get',
    params: data
  })
}

// 笔记分类
export function NoteCategory(data) {
  return request({
    url: '/?service=App.Note.Cates',
    method: 'get',
    params: {
      UserId: data
    }
  })
}
