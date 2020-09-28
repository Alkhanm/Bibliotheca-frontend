import http from "@/config/api/axios"
import {BOOK} from "@/config/api/url"

export default {
    state: {
        arr: []
    },
    mutations: {
        addAllBooks(state, books){
            state.arr.push(...books)
        },
        addBook(state, book){
            state.arr.push(book)
        }
    },
    actions: {
        async fetchBooks({commit, dispatch}, { id }){
            try {
                const response = await http.get(BOOK.URL, {params: {author: id}})
                const books = response.data
                console.log(books)
                commit("addAllBooks", books)
            } catch (err){
                dispatch("notify", {...err, time: 5000})
            }
        },
        async saveBook({commit, dispatch}, book){
            try {
                const response = await http.post(BOOK.URL, book)
                const newBook = response.data
                commit("addBook", newBook)
            } catch (err){
                dispatch("notify", {...err, time: 5000})
            }
        }
    },
    getters:{
        getBooksByAuthor: (state) => (author) => state.arr.filter(book => book.author === author),
        getBookById: (state) => (id) => state.arr.filter(book => book.id === id)
    }
}