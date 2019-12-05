import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/home/index'
import store from './store'
import {SPACE_TIME} from '@/config/config'

Vue.use(Router)

const router = new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/actions',
      name: 'actions',
      component: () => import('./views/actions/index.vue')
    },
    {
      path: '/venue',
      name: 'venue',
      component: () => import('./views/venue/index.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/login/index.vue'),
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('./views/user/index.vue'),
    },
    {
      path: '/classInfo',
      name: 'classInfo',
      component: () => import('./views/classInfo/index.vue'),
    },
    {
      path: '/createClasses',
      name: 'createClasses',
      component: () => import('./views/createClasses/index.vue'),
    },
    {
      path: '/teachers',
      name: 'teachers',
      component: () => import('./views/teachers/index.vue'),
    },
    {
      path: '/organization',
      name: 'organization',
      component: () => import('./views/organization/index.vue')
    },
    {
      path: '/fence',
      name: 'fence',
      component: () => import('./views/fence/index.vue')
    },
    {
      path: '/device',
      name: 'device',
      component: () => import('./views/device/index.vue')
    },
    {
      path: '/information',
      name: 'information',
      component: () => import('./views/information/index.vue')
    },
    {
      path: '/report',
      name: 'report',
      component: () => import('./views/report/index.vue')
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('./views/statistics/index.vue')
    },
    {
      path: '/map',
      name: 'amap',
      component: () => import('./views/amap/index.vue')
    },
    {
      path: '/details',
      name: 'detail',
      component: () => import('./views/details/index.vue'),
    },
    {
      path: '/increase',
      name: 'increase',
      component: () => import('./views/increase/index.vue')
    },
    {
      path: '/suggestion',
      name: 'suggestion',
      component: () => import('./views/suggestion/index.vue')
    },
    {
      path: '/mainstay',
      name: 'mainstay',
      component: () => import('./views/mainstay/index.vue')
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('./views/create/index.vue')
    },
    {
      path: '*',
      redirect: '/login'
    }
  ]
})


//路由守卫
router.beforeEach((to,from,next)=>{

  let newTime = new Date().getTime();
  let curTime = localStorage.curTime;

  if(newTime-curTime>SPACE_TIME){
    store.dispatch('setLogin',false);
    localStorage.removeItem('eleToken');
    localStorage.removeItem('userinfo');
  }

  const isLogin = store.state.isLogin
  
  if (to.path == "/login") {
    next()
  }else{
    isLogin ? next() : next({path: "/login", replace: true})
  }

})


export default router