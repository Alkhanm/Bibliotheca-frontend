import http from '@/config/api/axios'
import router from "@/config/router/index"
import { AUTH } from "@/config/api/url"
import { USER_KEY } from '@/global'


const signin = async ({ commit, dispatch }, payload) => {
    try {
        const response = await http.post(AUTH.LOGIN, payload)
        const user = response.data
        localStorage.setItem(USER_KEY, JSON.stringify(user))
        commit('addUser', user)
        commit('displayMenu', true)
        router.go({name: "Listas"})
    } catch (err) {
        dispatch("notify", { ...err.response.data, type: "error", time: 4000 })
    }
}

const signout = ({ commit }) => {
    localStorage.removeItem(USER_KEY)
    commit('addUser', {})
    commit('pullLists', [])
    router.go({name: "Login"})
}

const notify = ({ commit }, info) => {
    commit('inform', info)
    if (info.time) {
        const time = setInterval(() => {
            commit("inform", '')
            clearInterval(time);
        }, info.time);
    }
}

export { signin, signout, notify }


