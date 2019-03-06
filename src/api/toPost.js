import request from '@/utils/request'

// api前缀 ,代理跨域拦截
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
