import Vue from 'vue'
import VueRouter from 'vue-router'
import { validRouteLogin, validRoutes } from '@/services/validRoutes'

const Book = () =>
    import ('@/components/Book')
const Author = () =>
    import ('@/components/Author')
const Authentication = () =>
    import ('@/components/Authentication.vue')
import TheMenu from '@/components/TheMenu.vue'


Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
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
            props: true,
        },
        {
            path: "*",
            redirect: "/menu"
        }
    ]
})

router.beforeEach(validRoutes)

export default router