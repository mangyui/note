import { login, register } from '@/api/login'
// import { getToken, setToken, removeToken } from '@/utils/auth'
import Vue from 'vue'
import md5 from 'js-md5'
import qs from 'qs'
// import { mapState } from 'vuex'

// 排序加密
function objKeySort(obj) {
  var newkey = Object.keys(obj).sort()
  var newObj = {}
  for (var i = 0; i < newkey.length; i++) {
    newObj[newkey[i]] = obj[newkey[i]]
  }
  let signature = 'soq'
  for (var j = 0; j < newkey.length; j++) {
    signature += newObj[newkey[j]]
  }
  signature += 'soq'
  signature = md5(signature.toUpperCase())
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
      var datas1 = {
        username: userInfo.username.trim(),
        password: userInfo.password
      }
      var s = objKeySort(datas1)
      var datas2 = {
        username: userInfo.username.trim(),
        password: userInfo.password,
        sign: s
      }
      return new Promise((resolve, reject) => {
        login(qs.stringify(datas2)).then(response => {
          if (response.data.code === 0) {
            const data = response.data.data
            // setToken(data.token)
            commit('SET_USER', data)
            // commit('SET_NAME', data.Name)
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登录
    Register({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        register(qs.stringify(userInfo)).then(response => {
          if (response.data.code === 0) {
            // *************************************************注意
            const data = response.data.data
            // setToken(data.token)
            commit('SET_USER', data)
            // commit('SET_NAME', data.Name)
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
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
