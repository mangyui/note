import request from '@/utils/request'

export function login(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.User.Login',
    method: 'post',
    data: datas
  })
}

// 注册
export function register(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.User.Add',
    method: 'post',
    data: datas
  })
}

// 修改
export function UpdateUser(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '?service=App.User.Update',
    method: 'post',
    data: datas
  })
}
// **********************
export function getInfo(token) {
  return request({
    url: '/?service=App.User.GetUser',
    method: 'post',
    data: token
  })
}

// export function logout() {
//   return request({
//     url: '/data/user/logout.json',
//     method: 'get' // post
//   })
// }
