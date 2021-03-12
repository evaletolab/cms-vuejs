import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import Landing from '../views/Landing.vue'

import { $config, $user } from '@/services'

import About from '../views/About.vue'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/module',
    name: 'Modules',
    component: Home,
    beforeEnter: (to, from, next) =>{
      $user.get().then(user => {
        user.id ? next():next('/')
      })
    },
    // children:[{
    //   path: ':module_id/lesson/:lesson_id',
    //   name: 'Lesson',
    //   components: { l2 : Lesson}  
    // }]
  },
  {
    path: '/about',
    name: 'About',
    component: About
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition: any) {
    //console.log("--DBG: route position",savedPosition);
    return savedPosition || {
      x:0,
      y:undefined
    };
  },

})

export default router
