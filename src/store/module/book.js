import http from '@/services/api/axios'
import { BOOK } from "@/services/api/url"
import { deleteArchive } from "@/services/storage"

export default {
    state: { arr: [], loading: false },
    mutations: {
        addAllBooks(state, books) {
            state.arr.push(...books)
        },
        addBook(state, book) {
            state.arr.push(book)
        },
        removeBook({ arr }, { id }) {
            const book = arr.find(book => book.id === id)
            arr.splice(arr.indexOf(book), 1)
        },
    },
    actions: {
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

        async deleteBook({ commit, dispatch }, book) {
            try {
                await http.delete(`${BOOK.URL}/${book.id}`)
                await deleteArchive(book)
                commit("removeBook", book)
            } catch (err) {
                dispatch("notify", { ...err, time: 5000 })
            }
        },
        async updateBook({ commit }, book) {
            await http.put(`${BOOK.URL}/${book.id}`, book)
            commit("removeBook", book)
            commit("addBook", book)
        },
        async fetchLastBook(context) {
            const response = await http.get(`${BOOK.URL}/last`)
            const book = response.data[0]
            const isLast = context.state.arr.find(b => b === book)
            if (!isLast) context.commit("addBook", book)
            return book
        },
    },
    getters: {
        getBooksByAuthor: ({ arr }) => ({ id }) => arr.filter(book => book.author.id === id),
        getBookById: ({ arr }) => (id) => arr.find(book => book.id === id),
    }
}