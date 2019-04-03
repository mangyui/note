import Vue from 'vue'
import Router from 'vue-router'

// const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/

// 搜索不用懒加载
import Csearch from '@/views/home/search'

export const constantRouterMap = [
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/login',
  //   name: 'login',
  //   hidden: true
  // },
  {
    path: '',
    component: Layout,
    redirect: '/home/index'
  },
  { path: '/login', component: () => import('@/views/login'), meta: { title: 'Login' }, name: 'login', hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  // 主页
  {
    path: '/home',
    component: Layout,
    meta: { title: 'home', icon: 'home' },
    children: [
      {
        path: 'index',
        name: 'home',
        component: () => import('@/views/home/index'),
        meta: { title: 'home', icon: 'home' }
      },
      {
        path: 'search',
        name: 'search',
        hidden: true,
        component: Csearch,
        // component: () => import('@/views/home/search'),
        meta: { title: 'Search' }
      },
      {
        path: 'mistake/:id',
        name: 'mistake',
        hidden: true,
        component: () => import('@/views/home/mistake'),
        meta: { title: 'Mistake' }
      },
      {
        path: 'question_details/:id',
        name: 'question_details',
        hidden: true,
        component: () => import('@/views/home/question_details'),
        meta: { title: 'Question_Details' }
      },
      {
        path: 'ques_more/:id',
        name: 'ques_more',
        hidden: true,
        component: () => import('@/views/home/ques_more'),
        meta: { title: 'Ques_more' }
      }
    ]
  },
  // todo
  {
    path: '/SQu',
    component: Layout,
    redirect: '/SQu/mocr',
    meta: {
      title: 'SQu',
      icon: 'camera3'
    },
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'mocr',
        component: () => import('@/views/todo/mocr'),
        meta: { title: 'OcrSQu', icon: 'camera3' }
      }

    ]
  },
  // 组卷
  {
    path: '/getTest',
    component: Layout,
    redirect: '/getTest/index',
    meta: {
      title: 'getTest',
      icon: 'camera3'
    },
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'getTest',
        component: () => import('@/views/getTest/index'),
        meta: { title: 'getTest', icon: 'camera3' }
      }

    ]
  },
  // 用户
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    meta: { title: 'user', icon: 'me' },
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'user',
        component: () => import('@/views/user/index'),
        meta: { title: 'user', icon: 'me' }
      },
      {
        path: 'fans',
        name: 'fans',
        component: () => import('@/views/user/fans'),
        meta: { title: 'Fans', icon: 'me' }
      },
      {
        path: 'others/:id',
        name: 'others',
        component: () => import('@/views/user/others'),
        meta: { title: 'Others' }
      },
      {
        path: 'message',
        name: 'message',
        component: () => import('@/views/user/message'),
        meta: { title: 'Message' }
      }
    ]
  },

  // todo
  {
    path: '/todo',
    component: Layout,
    redirect: '/todo/voice',
    meta: {
      title: 'ToDo',
      icon: 'edit'
    },
    hidden: true,
    children: [
      {
        path: 'edit',
        name: 'edit',
        hidden: true,
        component: () => import('@/views/todo/edit'),
        meta: { title: 'Edit', icon: 'edit' }
      },
      {
        path: 'addMistake',
        name: 'addMistake',
        hidden: true,
        component: () => import('@/views/todo/addMistake'),
        meta: { title: 'addMistake' }
      }
    ]
  }
  // { path: '*', redirect: '/', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
export const asyncRouterMap = [
  // 切题
  {
    path: '/carveup',
    component: Layout,
    redirect: '/carveup/index',
    meta: {
      title: 'Test',
      icon: 'cutup'
    },
    children: [
      {
        path: 'index',
        name: 'carveup',
        component: () => import('@/views/carveup/index'),
        meta: { title: 'carveup', roles: ['teacher', 'student'] }
      },
      {
        path: 'testList',
        name: 'testList',
        component: () => import('@/views/carveup/testList'),
        meta: { title: 'testList', roles: ['teacher', 'student'] }
      },
      {
        path: 'studentList',
        name: 'studentList',
        component: () => import('@/views/carveup/studentList'),
        meta: { title: 'studentList', roles: ['teacher'] }
      },
      {
        path: 'test_detail/:id',
        name: 'test_detail',
        hidden: true,
        component: () => import('@/views/carveup/test_detail'),
        meta: { title: 'test_detail', roles: ['teacher', 'student'] }
      },
      {
        path: 'test_todo/:id',
        name: 'test_todo',
        hidden: true,
        component: () => import('@/views/carveup/test_todo'),
        meta: { title: 'test_todo', roles: ['student'] }
      },
      {
        path: 'test_student/:id',
        name: 'test_student',
        hidden: true,
        component: () => import('@/views/carveup/test_student'),
        meta: { title: 'test_student', roles: ['teacher'] }
      }
    ]
  },
  // 笔记
  {
    path: '/tonote',
    component: Layout,
    redirect: '/tonote/notes',
    meta: {
      title: 'ToNote',
      icon: 'note'
    },
    children: [
      {
        path: 'noteList',
        name: 'noteList',
        component: () => import('@/views/tonote/noteList'),
        meta: { title: 'NoteList' }
      },
      {
        path: 'note_type',
        name: 'note_type',
        component: () => import('@/views/tonote/note_type'),
        meta: { title: 'Note_type' }
      },
      {
        path: 'note_detail/:id',
        name: 'note_detail',
        hidden: true,
        component: () => import('@/views/tonote/note_detail'),
        meta: { title: 'Note_detail' }
      },
      {
        path: 'note_more',
        name: 'note_more',
        hidden: true,
        component: () => import('@/views/tonote/note_more'),
        meta: { title: 'Note_more' }
      },
      {
        path: 'note_edit/:id',
        name: 'note_edit',
        hidden: true,
        component: () => import('@/views/tonote/note_edit'),
        meta: { title: 'Note_edit' }
      }
    ]
  },
  // 错题
  {
    path: '/toques',
    component: Layout,
    redirect: '/toques/my_ques',
    meta: {
      title: 'ToQues',
      icon: 'cuoti'
    },
    children: [
      {
        path: 'quesList',
        name: 'quesList',
        component: () => import('@/views/toques/quesList'),
        meta: { title: 'QuesList' }
      },
      {
        path: 'collect',
        name: 'collect',
        component: () => import('@/views/toques/collect'),
        meta: { title: 'Collect' }
      },
      {
        path: 'mistake_type',
        name: 'mistake_type',
        component: () => import('@/views/toques/mistake_type'),
        meta: { title: 'Mistake_type' }
      }
    ]
  },

  // 题友
  // {
  //   path: '/friends',
  //   component: Layout,
  //   redirect: '/friends/schoolfellow',
  //   meta: { title: 'Friends', icon: 'peoples' },
  //   children: [
  //     {
  //       path: 'schoolfellow',
  //       name: 'schoolfellow',
  //       component: () => import('@/views/friends/schoolfellow'),
  //       meta: { title: 'Schoolfellow' }
  //     },
  //     {
  //       path: 'followee',
  //       name: 'followee',
  //       component: () => import('@/views/friends/followee'),
  //       meta: { title: 'Followee' }
  //     }
  //   ]
  // },

  // 表格
  // {
  //   path: '/table',
  //   component: Layout,
  //   redirect: '/table/complex-table',
  //   name: 'table',
  //   meta: {
  //     title: 'Table',
  //     icon: 'component'
  //   },
  //   children: [
  //     {
  //       path: 'complex-table',
  //       name: 'complex-table',
  //       component: () => import('@/views/table/complex-table'),
  //       meta: { title: 'complexTable', icon: 'component' }
  //     },
  //     {
  //       path: 'Tabs',
  //       name: 'Tabs',
  //       component: () => import('@/views/table/Tabs'),
  //       meta: { title: 'Tabs' }
  //     }

  //   ]
  // },
  // 更多
  // {
  //   path: '/more',
  //   component: Layout,
  //   meta: { title: 'More', icon: 'component' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'more',
  //       component: () => import('@/views/more/index'),
  //       meta: { title: 'More', icon: 'component' }
  //     },
  //     {
  //       path: 'dataNum',
  //       name: 'dashboard',
  //       hidden: true,
  //       component: () => import('@/views/dashboard/dashboard'),
  //       meta: { title: 'dashboard', icon: 'dashboard' }
  //     },
  //     {
  //       path: 'webs',
  //       name: 'webs',
  //       hidden: true,
  //       component: () => import('@/views/other/index'),
  //       meta: { title: 'Other', icon: 'baidumap' }
  //     },
  //     {
  //       path: 'charts',
  //       name: 'Charts',
  //       hidden: true,
  //       component: () => import('@/views/Charts/index'),
  //       meta: { title: 'Charts', icon: 'heatmapChart' }
  //     }
  //   ]
  // },
  // 商家
  {
    path: '/merchant',
    component: Layout,
    redirect: '/merchant/index',
    meta: { title: 'Other', icon: 'baidumap' },
    children: [
      {
        path: 'index',
        name: 'merchant',
        component: () => import('@/views/merchant/index'),
        meta: { title: 'Merchant', icon: 'shoppingCard' }
      }
    ]
  },
  // 第三方网站
  {
    path: '/other',
    component: Layout,
    redirect: '/more/index',
    hidden: true,
    meta: { title: 'Other', icon: 'baidumap' },
    children: [
      {
        path: 'open/:id',
        name: 'open',
        component: () => import('@/views/other/open'),
        meta: { title: 'Open' }
      }
    ]
  },
  // 报表
  // {
  //   path: '/dashboard',
  //   component: Layout,
  //   meta: { title: 'dashboard', icon: 'dashboard', roles: ['admin'] },
  //   children: [
  //     {
  //       path: 'dashboard',
  //       name: 'dashboard',
  //       component: () => import('@/views/dashboard/dashboard'),
  //       meta: { title: 'dashboard', icon: 'dashboard', roles: ['admin'] }
  //     }
  //   ]
  // },
  // 统计图
  // {
  //   path: '/Charts',
  //   component: Layout,
  //   redirect: '/Charts/index',
  //   meta: { title: 'Charts', icon: 'heatmapChart', roles: ['admin'] },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Charts',
  //       component: () => import('@/views/Charts/index'),
  //       meta: { title: 'Charts', icon: 'heatmapChart' }
  //     }
  //   ]
  // },
  // 关于 帮助
  {
    path: '/about',
    component: Layout,
    redirect: '/about/index',
    meta: { title: 'about', icon: 'international' },
    children: [
      {
        path: 'index',
        name: 'about',
        component: () => import('@/views/about/index'),
        meta: { title: 'about', icon: 'international' }
      }
    ]
  }
]
