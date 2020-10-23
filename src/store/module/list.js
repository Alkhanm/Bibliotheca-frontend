import http from '@/services/api/axios'
import replace from "@/services/replace"
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
        async saveList({ commit, state }, list) {
            const exists = state.arr.some(l => l.name.trim().toUpperCase() == list.name.trim().toUpperCase())
            if (exists) return;
            try {
                const response = await http.post(LIST.URL, list)
                const newList = response.data
                commit("addList", newList)
            } catch (err) {
                console.error(err)
                commit("inform", err.response.data)
            }
        },
        async deleteList({ commit, rootGetters }, list) {
            try {
                http.delete(`${LIST.URL}/${list.id}`)
                commit("deleteList", list)
                commit("removeAuthorsByList", list)
                const authors = rootGetters.getAuthorsByList(list)
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
    getters: {
        getOrderedList: ({ arr }) => (order) => {
            const listOrdered = arr.sort((list1, list2) => {
                const param1 = replace(list1[order].toString().toLowerCase())
                const param2 = replace(list2[order].toString().toLowerCase())
                if (param1 > param2) return 1
                if (param1 < param2) return -1
                return 0
            })
            return listOrdered
        },

    }
}