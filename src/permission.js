import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
// import { Message } from 'element-ui'
// import { getToken } from '@/utils/auth' // 验权
import {
  setTitle
} from '@/utils/util' // 设置浏览器头部标题

// permission judge function
// function hasPermission(roles, permissionRoles) {
//   if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
//   if (!permissionRoles) return true
//   return roles.some(role => permissionRoles.indexOf(role) >= 0)
// }

const whiteList = ['/login',
  '/',
  '/home/index', // 主页
  '/home/ques_more/',
  '/SQu/index', // 拍照搜题
  '/more/index', // 更多
  '/merchant/index', // 商家
  '/about/index', // 关于帮助
  '/home/search', // 搜索页
  '/home/question_details/', // 题目详情 有id的加上/
  '/home/mistake/', // 题目详情 有id的加上/
  '/home/other_answer/' // 题友解答
] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  // store.dispatch('LogOut')
  // console.log(store.getters.user.Id)
  if (!store.getters.user.Id) {
    if (whiteList.indexOf(to.path.replace(/\d+/g, '')) !== -1) {
      next()
    } else {
      next('/login')
    }
  } else {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (to.path.replace(/\d+/g, '') === '/user/others/' && to.params.id === store.getters.user.Id) {
        next({ path: '/user/index' })
      }
      // console.log(to)
      next()
    }
  }
  NProgress.done()
  // next() !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // next()
  // if (getToken()) {
  // store.dispatch('GetInfo')

  /* has token*/
  // if (to.path === '/login') {
  //   next({ path: '/' })
  //   NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
  // } else {
  //   if (store.getters.roles.length === 0) {
  //     store.dispatch('GetInfo').then(res => { // 拉取用户信息
  //       // const roles = res.roles // note: roles must be a array! such as: ['editor','develop']
  //       store.dispatch('GenerateRoutes').then(() => { // 根据roles权限生成可访问的路由表
  //         // router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
  //         next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
  //       })
  //     }).catch((err) => {
  //       store.dispatch('FedLogOut').then(() => {
  //         Message.error(err || 'Verification failed, please login again')
  //         next({ path: '/' })
  //       })
  //     })
  //   } else {
  //     // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
  //     next()
  //     // if (hasPermission(store.getters.roles, to.meta.roles)) {
  //     //   next()//
  //     // } else {
  //     //   next({ path: '/401', replace: true, query: { noGoBack: true }})
  //     // }
  //   }
  // }
  // } else {
  // if (whiteList.indexOf(to.path) !== -1) {
  // next()
  // } else {
  //   next('/login')
  //   NProgress.done()
  // }
  // }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
  setTimeout(() => {
    const browserHeaderTitle = store.getters.browserHeaderTitle
    setTitle(browserHeaderTitle)
  }, 0)
})
