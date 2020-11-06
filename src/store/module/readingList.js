import http from '@/services/api/axios'
import { LIST } from "@/services/api/url"
import { deleteArchives } from "@/services/storage"

export default {
    state: {
        arr: [],
        order: {
            type: "id",
            reverse: false
        },
        create: false
    },
    mutations: {
        pullLists(state, lists) { state.arr = lists },
        addList(state, readingList) { state.arr.push(readingList) },
        deleteList(state, readingList) {
            state.arr.splice(state.arr.indexOf(readingList), 1)
        },
        addOrderReadingList(state, payload) { state.order = payload },
        createList(state, payload) { state.create = payload },
    },
    actions: {
        async fetchLists({ commit }) {
            try {
                const response = await http.get(LIST.URL)
                const lists = response.data
                commit("pullLists", lists)
            } catch (err) {
                console.error(err)
                commit("inform", err.response.data)
            }
        },
        async saveList({ commit, state }, readingList) {
            const exists = state.arr.some(l => l.name.trim().toUpperCase() == readingList.name.trim().toUpperCase())
            if (exists) return;
            try {
                const response = await http.post(LIST.URL, readingList)
                const newList = response.data
                commit("addList", newList)
            } catch (err) {
                console.error(err)
                commit("inform", err.response.data)
            }
        },
        async deleteList({ commit, rootGetters }, readingList) {
            try {
                http.delete(`${LIST.URL}/${readingList.id}`)
                commit("deleteList", readingList)
                commit("removeAuthorsByList", readingList)
                const authors = rootGetters.getAuthorsByList(readingList)
                authors.forEach(author => {
                    const book = rootGetters.getBooksByAuthor(author).find(book => book.path != null)
                    const bookPath = book.path.split("/")
                    const path = bookPath.slice(0, bookPath.length - 1).join("/")
                    if (bookPath.length) deleteArchives(path)
                });
            } catch (err) {
                console.error(err)
                commit("inform", err.response.data)
            }
        }
    },
}