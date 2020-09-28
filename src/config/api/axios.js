import axios from 'axios'
import router from '@/config/router/index'
import store from '@/config/store/index'

import { BASE } from '@/config/api/url.js'

const http = axios.create({
    baseURL: BASE
})

http.interceptors.request.use(async (response) => {
    const token = store.state.user.token
    if (token) response.headers.Authorization = `Bearer ${token}`
    return response
})
function success(s) {
    return s
}
function error(e) {
    if (!e.response) {
        store.dispatch('notify', {
            message: "Erro de conexão. O servidor não está respondendo. Aguarde.",
            type: "error"
        })
        return Promise.reject(e)
    }
    const statusCode = e.response.status
    if (statusCode === 403 && router.currentRoute.name !== 'Auth') {
        store.dispatch("signout")
        router.push({name: "Login"})
        return Promise.reject(e)
    }
    //Faz o commit desse erro para ser apresentado no frontend
    store.dispatch('notify', { ...e.response.data, time: 4000 })
    return Promise.reject(e)
}
http.interceptors.response.use(success, error)

export default http