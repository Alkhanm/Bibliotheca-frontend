import http from '@/services/api/axios'
import {AUTHOR} from "@/services/api/url"
export default {
    state: {
        arr: []
    },
    mutations: {
        addAllAuthors(state, authors){ state.arr.push(...authors) },
        addAuthor(state, author){ state.arr.push(author) }
    },
    actions: {
        async fetchAuthors({commit}, list){
            const response = await http.get(AUTHOR.URL, {params: {list: list.id}})
            const authors = response.data
            commit("addAllAuthors", authors)
        },
        async saveAuthor({commit}, author){
            const response = await http.post(AUTHOR.URL, author)
            const newAuthor = response.data
            commit("addAuthor", newAuthor)
        }, 
        async deleteAuthor({state, dispatch}, author ){
            try {
                await http.delete(`${AUTHOR.URL}/${author.id}`)
                state.arr.splice(state.arr.indexOf(author), 1)
            } catch(err){
                dispatch("notify", {...err, time: 5000})
            }
        }
    },
    getters:{
        getAuthorsByList: ({arr}) => ({id}) => arr.filter(author => author.list.id === id)
    }
}