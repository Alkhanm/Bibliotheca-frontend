import Vue from 'vue'
import VueRouter from 'vue-router'

import Book from '@/components/Book'
import Author from '@/components/Author'
import TheMenu from  '@/components/TheMenu.vue'
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
      path: '/author/:id',
      name: 'Autor',
      component: Author,
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
