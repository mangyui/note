import request from '@/utils/request'

// api前缀 ,代理跨域拦截
// 上传题库
export function upQuestion(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/api/?s=Question.insert',
    method: 'post',
    data: datas
  })
}

// 添加错题
export function addMistake(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/api/?s=Mistake.add',
    method: 'post',
    data: datas
  })
}

// 识别匹配题目
export function ocrQues(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/api/?s=Question.search',
    method: 'post',
    data: datas
  })
}

// 搜索题目
export function SearchQues(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/api/?service=App.Question.Search',
    method: 'post',
    data: datas
  })
}

// 笔记详情
export function NoteDetails(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: 'api/?service=App.Note.GetOne',
    method: 'post',
    data: datas
  })
}

// 笔记列表
export function NoteList(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: 'api/?service=App.Note.NotesByCate',
    method: 'post',
    data: datas
  })
}

// 添加笔记
export function AddNote(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: 'api/?service=App.Note.Add',
    method: 'post',
    data: datas
  })
}

// 修改笔记
export function UpdateNote(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: 'api/?service=App.Note.Update',
    method: 'post',
    data: datas
  })
}
// 删除笔记
export function DeteleNote(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: 'api/?service=App.Note.Delete',
    method: 'post',
    data: datas
  })
}

// 笔记搜索
export function SearchNote(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: 'api/?service=App.Note.NotesByKeys',
    method: 'post',
    data: datas
  })
}

// *******************
// 点赞
export function P_dianZan(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/api/?service=App.Question.Search',
    method: 'post',
    data: datas
  })
}

// 收藏
export function P_toCollect(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/api/?service=App.Collection.Add',
    method: 'post',
    data: datas
  })
}

// 关注
export function P_toAttention(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/api/?service=App.Question.Search',
    method: 'post',
    data: datas
  })
}
