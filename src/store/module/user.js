import http from '@/services/api/axios'
import { USER } from "@/services/api/url"

export default {
    state: {
        id: 0,
        username: "",
        email: "",
        token: ""
    },
    mutations: {
        addUser(state, { id, username, email, token }) {
            state.id = id,
                state.username = username,
                state.email = email,
                state.token = token
        }
    },
    actions: {
        async saveUser({ commit }, user) {
            try {
                const response = await http.post(USER.URL, user)
                const newUser = response.data
                commit("addUser", newUser)
                return true
            } catch (err) {
                console.error(err)
                commit("inform", err.response.data)
            }
        }
    },
    getters: {
        getUsername(state) { return state.username }
    }
}