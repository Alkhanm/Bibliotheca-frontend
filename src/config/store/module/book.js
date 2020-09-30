import http from '@/config/services/api/axios'
import {BOOK} from "@/config/services/api/url"
import { deleteArchive } from "@/config/services/storage"
import qs from 'qs';

export default {
    state: { arr: [] },
    mutations: {
        addAllBooks(state, books){ state.arr.push(...books)},
        addBook(state, book){ state.arr.push(book)}
    },
    actions: {
        async fetchBooks({commit, dispatch}, { id }){
            try {
                const response = await http.get(BOOK.URL, {params: {author: id}})
                const books = response.data
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
        },
        async deleteBook({state, dispatch}, book ){
            try {
                await http.delete(`${BOOK.URL}/${book.id}`)
                await deleteArchive(book)
                state.arr.splice(state.arr.indexOf(book), 1)
            } catch(err){
                dispatch("notify", {...err, time: 5000})
            }
        },
        updatePage(context, {id, currentPage}){
            http.patch(`${BOOK.URL}/${id}`, qs.stringify({currentPage: currentPage}))
        },
    },
    getters:{
        getBooksByAuthor: ({arr}) => ({id}) => arr.filter(book => book.author.id === id),
        getBookById: ({arr}) => (id) => arr.find(book => book.id === id)
    }
}