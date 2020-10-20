import http from '@/services/api/axios'
import { LIST } from "@/services/api/url"
import { deleteArchives } from "@/services/storage"

export default {
    state: {
        arr: [],
        create: false
    },
    mutations: {
        pullLists(state, lists) { state.arr = lists },
        addList(state, list) { state.arr.push(list) },
        deleteList(state, list) {
            state.arr.splice(state.arr.indexOf(list), 1)
        },
        createList(state, payload) { state.create = payload },
    },
    actions: {
        async fetchLists({ commit, dispatch }) {
            try {
                const response = await http.get(LIST.URL)
                const lists = response.data
                commit("pullLists", lists)
            } catch (err) {
                dispatch("notify", err)
            }
        },
        async saveList({ commit, dispatch }, list) {
            try {
                const response = await http.post(LIST.URL, list)
                const newList = response.data
                commit("addList", newList)
            } catch (err) {
                dispatch("notify", { ...err, time: 5000 })
            }
        },
        async deleteList({ commit, rootGetters }, list) {
            try {
                const authors = rootGetters.getAuthorsByList(list)
                for (const author of authors) {
                    const book = rootGetters.getBooksByAuthor(author).find(book => book.path != null)
                    const bookPath = book.path.split("/")
                    const path = bookPath.slice(0, bookPath.length - 1).join("/")
                    if (bookPath.length) deleteArchives(path)
                }
                await http.delete(`${LIST.URL}/${list.id}`)
                commit("deleteList", list)
                commit("removeAuthorsByList", list)
            } catch (err) {
                console.error(err)
            }
        }
    },
    getters: {

    }
}