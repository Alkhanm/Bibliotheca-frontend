import http from "@/config/api/axios"
import {USER} from "@/config/api/url"
import {USER_KEY} from "@/global"

export default {
    state: {
        id: 0,
        username: "",
        email: "",
        token: ""
    },
    mutations: {
        addUser(state, { id, username, email, token}){ 
            state.id = id,
            state.username = username,
            state.email = email,
            state.token = token 
        }
    },
    actions: {
        async saveUser({commit, dispatch}, user){
            try {  
                const response = await http.post(USER.URL, user)
                const newUser = response.data
                localStorage.setItem(USER_KEY, JSON.stringify(newUser))
                commit("addUser", newUser)
            } catch(err){
                dispatch("notify", {...err, time: 5000})
          }
        }
    },
    getters:{
        getUsername(state) { return state.username }
    }
}