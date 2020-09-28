import Vue from 'vue'
import VueRouter from 'vue-router'

import NewBook from '@/components/book/NewBook.vue'
import Library from '@/components/book/Library.vue'
import Menu from '@/components/Menu.vue'
import Auth from '@/components/auth/Auth.vue'
import { validRouteLogin, validRoutes } from './util/validRoutes'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/auth',
      name: 'Login',
      component: Auth,
      beforeEnter: validRouteLogin
    },
    {
      path: '/menu',
      name: 'Listas',
      component: Menu
    },
    {
      path: '/new-book/:author',
      name: 'Novo Livro',
      component: NewBook,
      props: true
    },
    {
      path: '/library/:id',
      name: 'Livraria',
      component: Library,
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
