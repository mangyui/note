import axios from 'axios'
import { Message } from 'element-ui'
// import store from '../store'
// import { getToken } from '@/utils/auth'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-fromurlencodeed'
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 20000 // 请求超时时间
})

// request拦截器
// service.interceptors.request.use(config => {
//   if (store.getters.token) {
//     config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
//   }
//   return config
// }, error => {
//   // Do something with request error
//   console.log(error) // for debug
//   Promise.reject(error)
// })

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.ret !== 200) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 5 * 1000
      })

      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: '未正常响应',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
