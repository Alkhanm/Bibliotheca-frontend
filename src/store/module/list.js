import http from '@/services/api/axios'
import {LIST} from"@/services/api/url"

export default {
    state: { 
        arr: [], 
        create: false 
    },
    mutations: {
        pullLists(state, lists){ state.arr = lists },
        addList(state, list){ state.arr.push(list) },
        deleteList(state, list){
            state.arr.splice(state.arr.indexOf(list), 1)
        },
        createList(state, payload){ state.create = payload },
    },
    actions: {
        async fetchLists({commit, dispatch}){
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
               dispatch("notify", {...err, time: 5000})
           }
        },
        deleteList({commit, dispatch}, list){
            try {
                http.delete(`${LIST.URL}/${list.id}`)
                commit("deleteList", list)
                commit("removeAuthorsByList", list)                    
            } catch(err){
                dispatch("notify", {...err, time: 5000})
            }
        }
    },
    getters:{}
}