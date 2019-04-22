import Vue from 'vue'

import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import '../static/css/iconfont/1.0.0/index.css' /* icofont*/

// css
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/styles/index.scss' // global css

// import './mock' // simulation data

import App from './App'

import router from './router'

import store from './store'

// Internationalization
import i18n from './lang'

import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'

import {
  option
} from '@/utils/preview.js'
Vue.use(preview, option)

import '@/icons' // icon

import '@/permission' // permission control

Vue.use(ElementUI, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

Vue.config.productionTip = false

// 全局引入voice组件
// import VoiceInputButton from 'voice-input-button'
// Vue.use(VoiceInputButton)

// 全局引入wangedit
import E from 'wangeditor'
Vue.prototype.$E = E

// 将qs绑定
import qs from 'qs'
Vue.prototype.$qs = qs

// 监听设备加载，以实现打开相机功能
// document.addEventListener('deviceready', function() {
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
//   window.navigator.splashscreen.hide()
// }, false)
