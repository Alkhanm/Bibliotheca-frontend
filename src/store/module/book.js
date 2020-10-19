import http from '@/services/api/axios'
import { BOOK } from "@/services/api/url"
import { deleteArchive } from "@/services/storage"

export default {
    state: { 
        arr: [], 
        currentBook: { id: 0, img: "", path:"" }, 
        loading: false 
    },
    mutations: {
        addAllBooks(state, books) {
            state.arr.push(...books)
        },
        addBook(state, book) {
            state.arr.push(book)
        },
        addCurrentBook(state, book){
            state.currentBook = book
        },
        removeBook({ arr }, { id }) {
            const book = arr.find(book => book.id === id)
            arr.splice(arr.indexOf(book), 1)
        },
    },
    actions: {
        //Recebe um author como parametros, e busca na API pelos livros dele.
        async fetchBooks({ commit, dispatch }, { id }) {
            try {
                const response = await http.get(BOOK.URL, { params: { author: id } })
                const books = response.data
                commit("addAllBooks", books)
            } catch (err) {
                dispatch("notify", { ...err, time: 5000 })
            }
        },
        async saveBook({ commit, dispatch }, book) {
            try {
                const response = await http.post(BOOK.URL, book)
                const newBook = response.data
                commit("addBook", newBook)
            } catch (err) {
                dispatch("notify", { ...err, time: 5000 })
            }
        },

        async deleteBook({ commit, dispatch }, { id, path }) {
            try {
                await http.delete(`${BOOK.URL}/${id}`)
                if (path) {
                    await deleteArchive(path)
                    await deleteArchive(path + "-img")
                }
                commit("removeBook", { id })
            } catch (err) {
                dispatch("notify", { ...err, time: 5000 })
            }
        },
        async updateBook({ commit }, book) {
            await http.put(`${BOOK.URL}/${book.id}`, book)
            commit("removeBook", book)
            commit("addBook", book)
        },
        async fetchLastBook({ commit }) {
            const response = await http.get(`${BOOK.URL}/last`)
            const book = response.data
            if (book) commit("addCurrentBook", book)
        },
    },
    getters: {
        getBooksByAuthor: ({ arr }) => ({ id }) => arr.filter(book => book.author.id === id),
        getBookById: ({ arr }) => ( id ) => arr.find(book => book.id === id),
    }
}