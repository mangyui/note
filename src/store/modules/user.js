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
      Object.assign(state, user)
      if (user.Occupation === 1) {
        state.roles = ['teacher']
      } else if (user.Name === 'ming') {
        state.roles = ['admin']
      } else {
        state.roles = ['student']
      }
      localStorage.setItem('user', JSON.stringify(state))
    },
    SET_AVATAR: (state, avatar) => {
      state.Avatar = avatar
      // localStorage.removeItem('user')
      localStorage.setItem('user', JSON.stringify(state))
    },
    // 修改角色
    SET_ROSE: (state, roles) => {
      state.roles = roles
      localStorage.setItem('user', JSON.stringify(state))
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
    // 修改资料
    UpdateMe({ commit }, userInfo) {
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
    // 修改头像
    UpdateAvatar({ commit }, userAvatar) {
      return new Promise((resolve, reject) => {
        // console.log(userAvatar)
        commit('SET_AVATAR', userAvatar)
      })
    },
    // 修改角色身份
    UpdateRoles({ commit }, roles) {
      return new Promise((resolve, reject) => {
        commit('SET_ROSE', roles)
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
            commit('SET_USER', data)
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
        commit('OUT_USER')
      })
    }
  }
}

export default user
