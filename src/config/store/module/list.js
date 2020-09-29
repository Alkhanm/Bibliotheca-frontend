import http from "@/config/api/axios"
import {LIST} from "@/config/api/url"

export default {
    state: { arr: [], create: false },
    mutations: {
        pullLists(state, lists){ state.arr = lists },
        addList(state, list){ state.arr.push(list) },
        createList(state, payload){ state.create = payload },
    },
    actions: {
        async fetchList({commit, dispatch}){
            try { 
                const response = await http.get(LIST.URL)
                const lists = response.data
                commit("pullLists", lists)
            } catch (err){
                dispatch("notify", err)
            }
        },
        async saveList({commit, dispatch}, list){
            try {
                const response = await http.post(LIST.URL, list)
                const newList = response.data
                commit("addList", newList)
           } catch (err) {
               console.log(err)
               dispatch("notify", {...err, time: 5000})
           }
        },
        async deleteList({state, dispatch}, list){
            try {
                await http.delete(`${LIST.URL}/${list.id}`)
                state.arr.splice(state.arr.indexOf(list), 1)
            } catch(err){
                dispatch("notify", {...err, time: 5000})
            }
        }

    },
    getters:{}
}