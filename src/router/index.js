import Vue from 'vue'
import VueRouter from 'vue-router'

import Book from '@/components/Book'
import TheMenu from '@/components/TheMenu.vue'
import Authentication from '@/components/Authentication.vue'

import { validRouteLogin, validRoutes } from '@/services/validRoutes'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/auth',
      name: 'Login',
      component: Authentication,
      beforeEnter: validRouteLogin
    },
    {
      path: '/menu',
      name: 'Listas',
      component: TheMenu
    },
    {
      path: '/book/:id',
      name: 'Leitura',
      component: Book,
      props: true
    },
    {
      path: "*",
      redirect:"/menu"
    }
  ]
})

router.beforeEach(validRoutes)

export default router
