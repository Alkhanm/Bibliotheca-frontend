import http from '@/services/api/axios'
import { AUTHOR } from "@/services/api/url"
export default {
    state: {
        arr: [],
    },
    mutations: {
        newAuthor(state, payload){ state.create = payload },
        addAllAuthors(state, author){ state.arr.push(...author) },
        addAuthor(state, author){ state.arr.push(author) },
        removeAuthor({ arr }, { id }) {
            const author = arr.find(author => author.id === id)
            arr.splice(arr.indexOf(author), 1)
        }
    },
    actions: {
        async fetchAuthors({commit}, list){
            const response = await http.get(AUTHOR.URL, {params: { list: list.id }})
            const author = response.data
            commit("addAllAuthors", author)
        },
        async saveAuthor({commit}, author){
            const response = await http.post(AUTHOR.URL, author)
            const newAuthor = response.data
            commit("addAuthor", newAuthor)
            return newAuthor
        }, 
        async deleteAuthor({commit, dispatch}, author ){
            try {
                await http.delete(`${AUTHOR.URL}/${author.id}`)
                commit("removeAuthor", author)
            } catch(err){
                dispatch("notify", {...err, time: 5000})
            }
        },
    },
    getters:{
        getAuthorsByList: ({ arr }) => ({id}) => arr.filter(author => author.list.id === id),
        getAuthorById: ({ arr }) => (id) => arr.find(author => author.id === id )
    }
}