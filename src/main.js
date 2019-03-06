import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import '../static/css/iconfont/1.0.0/index.css' /* icofont*/

// css
import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import '@/styles/index.scss' // global css

import './mock' // simulation data

// font-awesome
import '@/assets/library/font-awesome-4.7.0/css/font-awesome.min.css'

import App from './App'

import router from './router'

import store from './store'

// Internationalization
import i18n from './lang'

// import {            //远程获取Font Awesome图标库
//   loadStyle
// } from './utils/util'
// import {
//   iconfontUrl,
//   iconfontVersion
// } from '@/config/env'

// iconfontVersion.forEach(ele => {
//   loadStyle(iconfontUrl.replace('$key', ele))
// })

import '@/icons' // icon

import '@/permission' // permission control

import * as filters from './filters' // global filters ************
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(ElementUI, { locale })

Vue.use(ElementUI, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

Vue.config.productionTip = false

// 监听手机设备加载，以实现打开相机功能
// document.addEventListener('deviceready', function() {
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  // template: '<App/>',
  // components: { App }
  render: h => h(App)
})
//   window.navigator.splashscreen.hide()
// }, false)
