import axios from 'axios'
import router from '@/router/index'
import store from '@/store/index'

import { USER_KEY } from "@/services/constants"
import { BASE } from './url.js'

const http = axios.create({ baseURL: BASE })

http.interceptors.request.use((response) => {
    const user = JSON.parse(localStorage.getItem(USER_KEY))
    if (user) response.headers.Authorization = `Bearer ${user.token}`
    return response
})
function success(s) {
    return s
}
function error(e) {
    if (!e.response) {
        store.commit('inform', {
            message: "Erro de conexão. O servidor não está respondendo. Aguarde.",
            type: "error"
        })
        return Promise.reject(e)
    }
    const statusCode = e.response.status
    if (statusCode === 403 && router.currentRoute.name !== 'Login') {
        store.dispatch("signout")
        router.push({ name: "Login" })
        return Promise.reject(e)
    }
    return Promise.reject(e)
}
http.interceptors.response.use(success, error)

export default http