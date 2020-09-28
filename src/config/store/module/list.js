import http from "@/config/api/axios"
import {LIST} from "@/config/api/url"

export default {
    state: {
        arr: [],
        create: false
    },
    mutations: {
        pullLists(state, lists){
            state.arr = lists
        },
        addList(state, list){
            state.arr.push(list)
        },
        createList(state, payload){
            state.create = payload
        }
    },
    actions: {
        async fetchList({commit}){
            const response = await http.get(LIST.URL)
            const lists = response.data
            commit("pullLists", lists)
        },
        async saveList({commit, dispatch}, list){
           try {
                const newList = await http.post(LIST.URL, list)
                commit("addList", newList)
           } catch (error) {
               dispatch("notify", {...error, type: "error", time: 5000})
               console.error(error)
           }
        }
    },
    getters:{}
}