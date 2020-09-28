import http from "@/config/api/axios"
import {AUTHOR} from "@/config/api/url"
export default {
    state: {
        arr: []
    },
    mutations: {
        addAllAuthors(state, authors){
            state.arr.push(...authors)
        },
        addAuthor(state, author){
            state.arr.push(author)
        }
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
        }
    },
    getters:{
        getAuthorsByList: (state) => ({id}) => {
            return state.arr.filter(author => author.list.id === id)
        }
    }
}