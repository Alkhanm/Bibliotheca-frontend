import http from '@/services/api/axios'
import { AUTH } from "@/services/api/url"
import { USER_KEY } from '@/services/constants'
import router from "@/router/index"
async function signin({ commit }, payload) {
    try {
        const response = await http.post(AUTH.LOGIN, payload)
        const user = response.data
        localStorage.setItem(USER_KEY, JSON.stringify(user))
        commit('addUser', user)
        commit('displayMenu', true)
        router.go({ name: "Listas" })
    } catch (err) {
        commit("inform", {...err.response.data, type: "error" })
    }
}

function signout({ commit }) {
    localStorage.removeItem(USER_KEY)
    commit('addUser', {})
    commit('pullLists', [])
    router.go({ name: "Login" })
}

export { signin, signout }