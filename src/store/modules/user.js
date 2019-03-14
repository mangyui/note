import { login, register, UpdateUser } from '@/api/login'
// import { getToken, setToken, removeToken } from '@/utils/auth'
import Vue from 'vue'
import md5 from 'js-md5'
import qs from 'qs'
// import { mapState } from 'vuex'

// sign排序加密,直接在传入数组中添加sign字段

// 规则：传入数组中所有字段排序后组合成一个字符串，并将字符串前后加soq，变成大写 并md5加密
function objKeySort(obj) {
  var newkey = Object.keys(obj).sort()
  var newObj = {}
  for (var i = 0; i < newkey.length; i++) {
    newObj[newkey[i]] = obj[newkey[i]]
  }
  let signature = 'soq'
  for (var j = 0; j < newkey.length; j++) {
    signature += newObj[newkey[j]] || ''
  }
  var date = new Date(+new Date() + 8 * 3600 * 1000).toISOString().replace(/T/g, '').replace(/\.[\d]{3}Z/, '')
  signature += date.substring(0, 10)
  signature += 'soq'
  signature = md5(signature.toUpperCase())

  obj.sign = signature

  return signature
}

const user = {
  state: JSON.parse(localStorage.getItem('user')) || {},

  mutations: {
    // 登录/更新
    SET_USER: (state, user) => {
      localStorage.setItem('user', JSON.stringify(user))
      Object.assign(state, user)
    },
    // 登出
    OUT_USER(state) {
      localStorage.removeItem('user')
      Object.keys(state).forEach(k => Vue.delete(state, k))
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.Name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },
  // computed: mapState({
  //   Id: function(state) {
  //     const localData = window.localStorage.getItem('user')
  //     console.log(localData, state.Id)
  //     if (state.Id === '' && localData) {
  //       this.$store.commit('GET_USER')
  //     }
  //     return state.Id
  //   }
  // }),
  actions: {
    // 登录
    Login({ commit }, userInfo) {
      // var datas1 = {
      //   username: userInfo.username.trim(),
      //   password: md5(userInfo.password)
      // }
      var datas2 = {
        username: userInfo.username.trim(),
        password: md5(userInfo.password)
        // sign: s
      }
      objKeySort(datas2) // 添加sign字段
      // datas2.sign = s
      return new Promise((resolve, reject) => {
        login(qs.stringify(datas2)).then(response => {
          if (response.data.code === 0) {
            const data = response.data.data
            // setToken(data.token)
            commit('SET_USER', data)
            // commit('SET_NAME', data.Name)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 修改
    UpdateMe({ commit }, userInfo) {
      // var datas1 = {
      //   username: userInfo.username.trim(),
      //   password: userInfo.password
      // }
      // var s = objKeySort(datas1)
      var datas2 = {
        username: userInfo.username.trim(),
        userid: userInfo.userid,
        password: userInfo.password,
        sex: userInfo.Sex,
        class: userInfo.Class,
        schoolId: userInfo.SchoolId,
        address: userInfo.Address,
        intro: userInfo.Intro
      }
      objKeySort(datas2)// 添加sign字段，sign规则已修改
      // datas2.sign = s
      // console.log(datas2)
      return new Promise((resolve, reject) => {
        UpdateUser(qs.stringify(datas2)).then(response => {
          if (response.data.code === 0) {
            const data = response.data.data
            // setToken(data.token)
            commit('OUT_USER')
            commit('SET_USER', data)
            // commit('SET_NAME', data.Name)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 注册
    Register({ commit }, userInfo) {
      var datas1 = {
        username: userInfo.username.trim(),
        password: md5(userInfo.password),
        phone: userInfo.phone,
        class: userInfo.class
      }
      return new Promise((resolve, reject) => {
        register(qs.stringify(datas1)).then(response => {
          if (response.data.code === 0) {
            // *************************************************
            const data = response.data.data
            // setToken(data.token)
            commit('SET_USER', data)
            // commit('SET_NAME', data.Name)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        // logout().then(() => {
        commit('OUT_USER')
        // commit('SET_ROLES', [])
        // removeToken()
        //   resolve()
        // }).catch(error => {
        //   reject(error)
        // })
      })
    }
    // 获取用户信息
    // GetInfo({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     getInfo(state.Name).then(response => {
    //       const data = response
    //       // if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
    //       //   commit('SET_ROLES', data.roles)
    //       // } else {
    //       //   reject('getInfo: roles must be a non-null array !')
    //       // }
    //       commit('SET_NAME', data.name)
    //       commit('SET_AVATAR', data.avatar)
    //       resolve(response)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 前端 登出
    // FedLogOut({ commit }) {
    //   return new Promise(resolve => {
    //     commit('SET_TOKEN', '')
    //     // removeToken()
    //     resolve()
    //   })
    // },
    // // 动态修改权限
    // ChangeRoles({ commit }, role) {
    //   return new Promise(resolve => {
    //     commit('SET_TOKEN', role)
    //     // setToken(role)
    //     getInfo(role).then(response => {
    //       const data = response
    //       commit('SET_ROLES', data.roles)
    //       commit('SET_NAME', data.name)
    //       commit('SET_AVATAR', data.avatar)
    //       resolve()
    //     })
    //   })
    // }
  }
}

export default user
