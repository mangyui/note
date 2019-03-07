import request from '@/utils/request'
// import md5 from 'js-md5'

// function objKeySort(obj) {
//   var newkey = Object.keys(obj).sort()
//   var newObj = {}
//   for (var i = 0; i < newkey.length; i++) {
//     newObj[newkey[i]] = obj[newkey[i]]
//     // newObj[newkey[i].toLowerCase()]
//   }

//   return newObj
// }

export function login(username, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/data/user/login.json',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/data/user/logout.json',
    method: 'get' // post
  })
}
