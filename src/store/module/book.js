import http from '@/services/api/axios'
import { BOOK, READING } from "@/services/api/url"
import { deleteArchive } from "@/services/storage"

export default {
    state: {
        arr: [],
        currentBook: { id: 0, img: "", path: "" },
        loading: false
    },
    mutations: {
        addAllBooks(state, books) {
            state.arr.push(...books)
        },
        addBook(state, book) {
            state.arr.push(book)
        },
        addCurrentBook(state, book) {
            state.currentBook = book
        },
        removeBook({ arr }, { id }) {
            const book = arr.find(book => book.id === id)
            arr.splice(arr.indexOf(book), 1)
        },
        updateBook(state, book) {
            const newBook = { ...book }
            const oldBook = state.arr.find(b => b.id === book.id)
            state.arr.splice(state.arr.indexOf(oldBook), 1)
            state.arr.push(newBook)
        }
    },
    actions: {
        //Recebe um author como parametros, e busca na API pelos livros dele.
        async fetchBooks({ commit }, { id }) {
            try {
                const response = await http.get(BOOK.URL, { params: { author: id } })
                const books = response.data
                commit("addAllBooks", books)
            } catch (err) {
                commit("inform", err.response.data)
            }
        },
        async saveBook({ commit }, book) {
            try {
                const response = await http.post(BOOK.URL, book)
                const newBook = response.data
                commit("addBook", newBook)
            } catch (err) {
                commit("inform", { ...err.response.data, type: "warning" })
            }
        },

        async deleteBook({ commit }, { id, path }) {
            try {
                await http.delete(`${BOOK.URL}/${id}`)
                if (path) {
                    await deleteArchive(path)
                    await deleteArchive(path + "-img")
                }
                commit("removeBook", { id })
            } catch (err) {
                commit("inform", err.response.data)
            }
        },
        async updateBook({ commit }, book) {
            try {
                await http.put(`${BOOK.URL}/${book.id}`, book)
                commit("updateBook", book)
            } catch (err) {
                console.error(err)
            }
        },
        async updateReading({ commit, getters }, reading) {
            try {
                await http.put(`${READING.URL}/${reading.id}`, reading)
                const book = getters.getBookByReading(reading)
                book.reading = reading
                commit("updateBook", book)
            } catch (err) {
                console.error(err)
            }
        },
        async fetchLastBook({ commit }) {
            const response = await http.get(`${BOOK.URL}/last`)
            const book = response.data
            if (book) commit("addCurrentBook", book)
        },
    },
    getters: {
        getBooksByAuthor: ({ arr }) => ({ id }) => arr.filter(book => book.author.id === id),
        getBookById: ({ arr }) => (id) => arr.find(book => book.id === id),
        getBookByReading: (state) => ({ id }) => state.arr.find(book => book.reading.id === id) || state.currentBook
    }
}