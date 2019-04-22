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

// 问题分类
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

// 错题详情
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

// 笔记分类
export function GetNoteCount(data) {
  return request({
    url: '/?service=App.Note.Count',
    method: 'get',
    params: {
      UserId: data
    }
  })
}

// 通过教师id查找测试列表
export function GetAllByTeacher(Tid) {
  return request({
    url: '/?service=App.Test.GetAllByTeacher',
    method: 'get',
    params: {
      Tid: Tid
    }
  })
}
// 通过教师id和班级id查找测试列表
export function GetTestByTidAndUid(TeacherId, UserrelationId) {
  return request({
    url: '/?service=App.Test.GetByTidRid',
    method: 'get',
    params: {
      TeacherId,
      UserrelationId
    }
  })
}
// 通过班级列表
export function GetClassList() {
  return request({
    url: '/?service=App.Userelation.GetList',
    method: 'get',
    params: {}
  })
}

// 通过班级列表
export function GetListByTid(Tid) {
  return request({
    url: '/?service=App.Userelation.GetListTid',
    method: 'get',
    params: {
      Tid: Tid
    }
  })
}
// 获取测试详情
export function GetTestDetail(Id) {
  return request({
    url: '/?service=App.Test.GetTestDetail',
    method: 'get',
    params: {
      Id
    }
  })
}
