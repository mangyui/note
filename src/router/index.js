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
  { path: '/login', component: () => import('@/views/login'), name: 'login', hidden: true },
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
        component: () => import('@/views/home/search'),
        meta: { title: 'Search' }
      },
      {
        path: 'other_answer/:id',
        name: 'other_answer',
        hidden: true,
        component: () => import('@/views/home/other_answer'),
        meta: { title: 'Other_Answer' }
      },
      {
        path: 'question_details/:id',
        name: 'question_details',
        hidden: true,
        component: () => import('@/views/home/question_details'),
        meta: { title: 'Question_Details' }
      }
    ]
  },
  // todo
  {
    path: '/SQu',
    component: Layout,
    redirect: '/add/mocr',
    meta: {
      title: 'SQu',
      icon: 'camera3'
    },
    children: [
      {
        path: 'index',
        name: 'mocr',
        component: () => import('@/views/todo/mocr'),
        meta: { title: 'OcrSQu', icon: 'camera3' }
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
        path: 'others/:id',
        name: 'others',
        component: () => import('@/views/user/others'),
        meta: { title: 'Others' }
      }
    ]
  },
  // 题友
  {
    path: '/friends',
    component: Layout,
    redirect: '/friends/schoolfellow',
    meta: { title: 'Friends', icon: 'peoples' },
    children: [
      {
        path: 'schoolfellow',
        name: 'schoolfellow',
        component: () => import('@/views/friends/schoolfellow'),
        meta: { title: 'Schoolfellow' }
      },
      {
        path: 'followee',
        name: 'followee',
        component: () => import('@/views/friends/followee'),
        meta: { title: 'Followee' }
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
        path: 'speech',
        name: 'speech',
        component: () => import('@/views/todo/speech'),
        meta: { title: 'Speech' }
      },
      {
        path: 'edit/:id',
        name: 'edit',
        hidden: true,
        component: () => import('@/views/todo/edit'),
        meta: { title: 'Edit', icon: 'edit' }
      },
      {
        path: 'voice',
        name: 'voice',
        component: () => import('@/views/todo/voice'),
        meta: { title: 'Voice' }
      }
      // {
      //   path: 'ocr',
      //   name: 'ocr',
      //   hidden: true,
      //   component: () => import('@/views/todo/ocr'),
      //   meta: { title: 'OCR' }
      // },
      // {
      //   path: 'mocr',
      //   name: 'mocr',
      //   component: () => import('@/views/todo/mocr'),
      //   meta: { title: 'MOCR' }
      // }

    ]
  },
  // 错题
  {
    path: '/toques',
    component: Layout,
    redirect: '/toques/my_ques',
    meta: {
      title: 'ToQues',
      icon: 'form'
    },
    children: [
      {
        path: 'collect',
        name: 'collect',
        component: () => import('@/views/toques/collect'),
        meta: { title: 'Collect' }
      },
      {
        path: 'knowledge',
        name: 'knowledge',
        component: () => import('@/views/toques/knowledge'),
        meta: { title: 'Knowledge' }
      },
      {
        path: 'my_answer/:id',
        name: 'my_answer',
        hidden: true,
        component: () => import('@/views/toques/my_answer'),
        meta: { title: 'My_Answer' }
      },
      {
        path: 'quesList',
        name: 'quesList',
        component: () => import('@/views/toques/quesList'),
        meta: { title: 'QuesList' }
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
      icon: 'form'
    },
    children: [
      {
        path: 'notes',
        name: 'noteList',
        component: () => import('@/views/tonote/noteList'),
        meta: { title: 'NoteList', icon: 'documentation' }
      },
      {
        path: 'note_detail/:id',
        name: 'note_detail',
        hidden: true,
        component: () => import('@/views/tonote/note_detail'),
        meta: { title: 'Note_detail' }
      }
    ]
  },
  // 表单
  // {
  //   path: '/form',
  //   component: Layout,
  //   redirect: '/table/BaseForm',
  //   name: 'form',
  //   meta: {
  //     title: 'form',
  //     icon: 'documentation'
  //   },
  //   children: [
  //     {
  //       path: 'BaseForm',
  //       name: 'BaseForm',
  //       component: () => import('@/views/form/BaseForm'),
  //       meta: { title: 'BaseForm', icon: 'documentation' }
  //     }
  //     {
  //       path: 'Upload',
  //       name: 'Upload',
  //       component: () => import('@/views/form/Upload'),
  //       meta: { title: 'Upload' }
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
  {
    path: '/more',
    component: Layout,
    meta: { title: 'More', icon: 'component' },
    children: [
      {
        path: 'index',
        name: 'more',
        component: () => import('@/views/more/index'),
        meta: { title: 'More', icon: 'component' }
      },
      {
        path: 'dataNum',
        name: 'dashboard',
        hidden: true,
        component: () => import('@/views/dashboard/dashboard'),
        meta: { title: 'dashboard', icon: 'dashboard' }
      },
      {
        path: 'webs',
        name: 'webs',
        hidden: true,
        component: () => import('@/views/other/index'),
        meta: { title: 'Other', icon: 'baidumap' }
      },
      {
        path: 'charts',
        name: 'Charts',
        hidden: true,
        component: () => import('@/views/Charts/index'),
        meta: { title: 'Charts', icon: 'heatmapChart' }
      }
    ]
  },
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
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
export const asyncRouterMap = [

  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'errorPages',
  //   meta: {
  //     title: 'errorPages',
  //     icon: '404'
  //   },
  //   children: [
  //     { path: '401', component: () => import('@/views/errorPage/401'), name: 'page401', meta: { title: 'page401', noCache: true }},
  //     { path: '404', component: () => import('@/views/errorPage/404'), name: 'page404', meta: { title: 'page404', noCache: true }}
  //   ]
  // },

  // 主页
  // {
  //   path: '/home',
  //   component: Layout,
  //   meta: { title: 'home', icon: 'home' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'home',
  //       component: () => import('@/views/home/index'),
  //       meta: { title: 'home', icon: 'home' }
  //     },
  //     {
  //       path: 'search',
  //       name: 'search',
  //       hidden: true,
  //       component: () => import('@/views/home/search'),
  //       meta: { title: 'Search' }
  //     },
  //     {
  //       path: 'other_answer/:id',
  //       name: 'other_answer',
  //       hidden: true,
  //       component: () => import('@/views/home/other_answer'),
  //       meta: { title: 'Other_Answer' }
  //     },
  //     {
  //       path: 'question_details/:id',
  //       name: 'question_details',
  //       hidden: true,
  //       component: () => import('@/views/home/question_details'),
  //       meta: { title: 'Question_Details' }
  //     }
  //   ]
  // },
  // // 用户
  // {
  //   path: '/user',
  //   component: Layout,
  //   redirect: '/user/index',
  //   meta: { title: 'user', icon: 'me' },
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'user',
  //       component: () => import('@/views/user/index'),
  //       meta: { title: 'user', icon: 'me' }
  //     },
  //     {
  //       path: 'others/:id',
  //       name: 'others',
  //       component: () => import('@/views/user/others'),
  //       meta: { title: 'Others' }
  //     }
  //   ]
  // },
  // // 题友
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

  // // todo
  // {
  //   path: '/todo',
  //   component: Layout,
  //   redirect: '/todo/voice',
  //   meta: {
  //     title: 'ToDo',
  //     icon: 'edit'
  //   },
  //   children: [
  //     // {
  //     //   path: 'speech',
  //     //   name: 'speech',
  //     //   component: () => import('@/views/todo/speech'),
  //     //   meta: { title: 'Speech' }
  //     // },
  //     {
  //       path: 'edit/:id',
  //       name: 'edit',
  //       component: () => import('@/views/todo/edit'),
  //       meta: { title: 'Edit' }
  //     },
  //     {
  //       path: 'voice',
  //       name: 'voice',
  //       component: () => import('@/views/todo/voice'),
  //       meta: { title: 'Voice' }
  //     },
  //     {
  //       path: 'ocr',
  //       name: 'ocr',
  //       hidden: true,
  //       component: () => import('@/views/todo/ocr'),
  //       meta: { title: 'OCR' }
  //     },
  //     {
  //       path: 'mocr',
  //       name: 'mocr',
  //       component: () => import('@/views/todo/mocr'),
  //       meta: { title: 'MOCR' }
  //     }

  //   ]
  // },

  // // 笔记
  // {
  //   path: '/tonote',
  //   component: Layout,
  //   redirect: '/tonote/notes',
  //   meta: {
  //     title: 'ToNote',
  //     icon: 'form'
  //   },
  //   children: [
  //     {
  //       path: 'note-type',
  //       name: 'note_type',
  //       component: () => import('@/views/tonote/note-type'),
  //       meta: { title: 'Note_type' }
  //     },
  //     {
  //       path: 'notes',
  //       name: 'notes',
  //       component: () => import('@/views/tonote/notes'),
  //       meta: { title: 'Notes' }
  //     },
  //     {
  //       path: 'note-big',
  //       name: 'BigNotes',
  //       component: () => import('@/views/tonote/note-big'),
  //       meta: { title: 'BigNotes' }
  //     },
  //     {
  //       path: 'my_answer/:id',
  //       name: 'my_answer',
  //       hidden: true,
  //       component: () => import('@/views/tonote/my_answer'),
  //       meta: { title: 'My_Answer' }
  //     },
  //     {
  //       path: 'my_ques',
  //       name: 'my_ques',
  //       component: () => import('@/views/tonote/my_ques'),
  //       meta: { title: 'My_Ques' }
  //     }
  //   ]
  // },
  // // 表单
  // // {
  // //   path: '/form',
  // //   component: Layout,
  // //   redirect: '/table/BaseForm',
  // //   name: 'form',
  // //   meta: {
  // //     title: 'form',
  // //     icon: 'documentation'
  // //   },
  // //   children: [
  // //     {
  // //       path: 'BaseForm',
  // //       name: 'BaseForm',
  // //       component: () => import('@/views/form/BaseForm'),
  // //       meta: { title: 'BaseForm', icon: 'documentation' }
  // //     }
  // //     {
  // //       path: 'Upload',
  // //       name: 'Upload',
  // //       component: () => import('@/views/form/Upload'),
  // //       meta: { title: 'Upload' }
  // //     }
  // //   ]
  // // },

  // // 表格
  // // {
  // //   path: '/table',
  // //   component: Layout,
  // //   redirect: '/table/complex-table',
  // //   name: 'table',
  // //   meta: {
  // //     title: 'Table',
  // //     icon: 'component'
  // //   },
  // //   children: [
  // //     {
  // //       path: 'complex-table',
  // //       name: 'complex-table',
  // //       component: () => import('@/views/table/complex-table'),
  // //       meta: { title: 'complexTable', icon: 'component' }
  // //     },
  // //     {
  // //       path: 'Tabs',
  // //       name: 'Tabs',
  // //       component: () => import('@/views/table/Tabs'),
  // //       meta: { title: 'Tabs' }
  // //     }

  // //   ]
  // // },
  // // 更多
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
  // // 商家
  // {
  //   path: '/merchant',
  //   component: Layout,
  //   redirect: '/merchant/index',
  //   meta: { title: 'Other', icon: 'baidumap' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'merchant',
  //       component: () => import('@/views/merchant/index'),
  //       meta: { title: 'Merchant', icon: 'shoppingCard' }
  //     }
  //   ]
  // },
  // // 第三方网站
  // {
  //   path: '/other',
  //   component: Layout,
  //   redirect: '/more/index',
  //   hidden: true,
  //   meta: { title: 'Other', icon: 'baidumap' },
  //   children: [
  //     {
  //       path: 'open/:id',
  //       name: 'open',
  //       component: () => import('@/views/other/open'),
  //       meta: { title: 'Open' }
  //     }
  //   ]
  // },
  // // 报表
  // // {
  // //   path: '/dashboard',
  // //   component: Layout,
  // //   meta: { title: 'dashboard', icon: 'dashboard', roles: ['admin'] },
  // //   children: [
  // //     {
  // //       path: 'dashboard',
  // //       name: 'dashboard',
  // //       component: () => import('@/views/dashboard/dashboard'),
  // //       meta: { title: 'dashboard', icon: 'dashboard', roles: ['admin'] }
  // //     }
  // //   ]
  // // },
  // // 统计图
  // // {
  // //   path: '/Charts',
  // //   component: Layout,
  // //   redirect: '/Charts/index',
  // //   meta: { title: 'Charts', icon: 'heatmapChart', roles: ['admin'] },
  // //   children: [
  // //     {
  // //       path: 'index',
  // //       name: 'Charts',
  // //       component: () => import('@/views/Charts/index'),
  // //       meta: { title: 'Charts', icon: 'heatmapChart' }
  // //     }
  // //   ]
  // // },
  // // 关于 帮助
  // {
  //   path: '/about',
  //   component: Layout,
  //   redirect: '/about/index',
  //   meta: { title: 'about', icon: 'international' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'about',
  //       component: () => import('@/views/about/index'),
  //       meta: { title: 'about', icon: 'international' }
  //     }
  //   ]
  // },
  // { path: '*', redirect: '/404', hidden: true }
]
