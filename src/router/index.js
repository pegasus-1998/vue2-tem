import Vue from 'vue'
import VueRouter from 'vue-router'

import homeRouter from './home'
import seckillRouter from './seckill'
import shopCarRouter from './shopCar'
import bazaarRouter from './bazaar'
import store from '@/store'
Vue.use(VueRouter)

const routes = [
  {
    path: '',
    component: () => import('@/layout'),
    children: [
      ...homeRouter,
      ...seckillRouter,
      ...shopCarRouter,
      bazaarRouter,
      {
        path: 'recr',
        component: () => import('@/pages/recr'),
        meta: {
          title: '娱乐'
        }
      },
      {
        path: '/admin',
        component: () => import('@/pages/admin'),
        meta: {
          title: '用户管理'
        }
      },
      {
        path: '/person',
        component: () => import('@/pages/person'),
        meta: {
          title: '个人信息'
        }
      }
    ]
  },
  {
    path: '/account',
    component: () => import('@/pages/account'),
    meta: {
      title: '账号'
    }
  },
  {
    path: '/detail',
    component: () => import('@/pages/details'),
    meta: {
      title: '详情'
    }
  },
  {
    path: '*',
    component: () => import('@/pages/error/404.vue'),
    meta: {
      title: '404'
    }
  }
]

//解决点击路由跳转同名报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  routes,
  mode: 'hash'  //history
})

VueRouter.prototype.goBack = function () {
  this.go(-1)
}

router.beforeEach((to,from,next) => {
  if(to.path !== '/person') {
    next()
  }else {
    const users = store.state.userModule.users
    const token = store.state.userModule.token
    const flag = users.some(item => item.token === token)
    if(!flag) {
      next('/account')
      Vue.prototype.$message({
        type: 'error',
        message: '请先登录！'
      })
    }else {
      next()
    }
  }
})

router.afterEach(to => document.title = to.meta.title || '淘宝网 - 淘！我喜欢')

export default router
