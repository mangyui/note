import request from '@/utils/request'

export function login(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/api/?service=App.User.Login',
    method: 'post',
    data: datas
  })
}

// **********************
export function getInfo(token) {
  return request({
    url: '/api/?service=App.User.GetUser',
    method: 'post',
    data: token
  })
}

// 注册
export function register(datas) {
  return request({
    url: '/api/?service=App.User.GetUser',
    method: 'post',
    data: datas
  })
}
// export function logout() {
//   return request({
//     url: '/data/user/logout.json',
//     method: 'get' // post
//   })
// }
