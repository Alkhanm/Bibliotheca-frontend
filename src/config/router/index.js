import Vue from 'vue'
import VueRouter from 'vue-router'

import { validateLogin, validateRoutes } from './util/login'

import NewBook from '@/components/book/NewBook.vue'
import Library from '@/components/book/Library.vue'
import Menu from '@/components/Menu.vue'
import Auth from '@/components/auth/Auth.vue'

Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/auth',
      name: 'Login',
      component: Auth,
      beforeEnter: validateLogin
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
      path: '*',
      redirect: "/menu"
    }
  ]
})

router.beforeEach(validateRoutes)

export default router
