import request from '@/utils/request'

// api前缀 ,代理跨域拦截
// 上传题库
export function upQuestion(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/api/public/?s=Question_CURD.insert',
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
    url: '/api/public/?s=Mistake.add',
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
    url: '/api/public/?s=Question_CURD.search',
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
    url: '/api/public/?service=App.Question_CURD.Search',
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
    url: '/api/public/?service=App.Question_CURD.Search',
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
    url: '/api/public/?service=App.Question_CURD.Search',
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
    url: '/api/public/?service=App.Question_CURD.Search',
    method: 'post',
    data: datas
  })
}
