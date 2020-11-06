import http from '@/services/api/axios'
import { replace } from "@/services/utils"
import { BOOK, READ } from "@/services/api/url"
import { deleteArchive } from "@/services/storage"

export default {
    state: {
        arr: [],
        currentBook: { id: 0, img: "", path: "" },
        order: {
            type: "",
            reverse: true
        }
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
        addOrderBook(state, payload) { state.order = payload },
        removeBook({ arr }, { id }) {
            const book = arr.find(book => book.id === id)
            arr.splice(arr.indexOf(book), 1)
        },
        updateBook(state, book) {
            const newBook = {...book }
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
                commit("inform", {...err.response.data, type: "warning" })
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
        async updateRead({ commit, getters }, read) {
            try {
                http.put(`${READ.URL}/${read.id}`, read)
                const book = getters.getBookByReading(read)
                book.read = read
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
        getBooksByAuthor: ({ arr }) => ({ id }, order) => {
            const books = arr.filter(book => book.author.id === id)
            const booksOrdered = books.sort((book1, book2) => {
                if (!book1.serie) return 1
                if (!book2.serie) return -1
                const param1 = order ? replace(book1[order].toString()) : book1.serie.id
                const param2 = order ? replace(book2[order].toString()) : book2.serie.id
                if (param1 > param2) return 1
                if (param1 < param2) return -1
                return 0
            })
            return booksOrdered
        },
        getBookById: ({ arr, currentBook }) => (id) => {
            const book = arr.find(book => book.id === id) || currentBook
            return book
        },
        getBookByReading: ({ arr }) => (read) => {
            const book = arr.find(book => book.read === read)
            return book
        },
        getSeries({ arr }) {
            const series = arr.filter(b => b.serie).map(({ serie }) => serie.name)
            return series;
        }
    }
}