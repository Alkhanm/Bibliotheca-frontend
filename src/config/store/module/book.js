import http from "@/config/api/axios"
import {BOOK} from "@/config/api/url"
import {storage} from "firebase/app"
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
        updatePage(context, {id, currentPage}){
            http.patch(`${BOOK.URL}/${id}`, qs.stringify({currentPage: currentPage}))
        },
        async uploadBook({dispatch}, {path, file}){
            try { 
                const ref = storage().ref()
                const child = ref.child(path)
                await child.put(file)}
            catch(err){
                dispatch("notify", {...err, message: "Erro ao fazer upload do arquivo", time:4000, type: "warning"})
            }
        },
        uploadImg(context, {path, imgDataURL}){
            try {
                const ref = storage().ref()
                const child = ref.child(path)
                const dataUrl = imgDataURL.split(",")[1]
                child.putString(dataUrl, "base64", {contentType: 'image/jpeg'})
            } catch (err) {
                console.error("Não foi possivel salvar um imagem deste livro.",err)
            }
        },
        async downloadBook({dispatch}, {path}){
            try {
                const ref = storage().ref()
                const pdf = await ref.child(path).getDownloadURL()
                const img = await ref.child(path + "-img").getDownloadURL()
                return { pdf, img }
            } catch (err) {
                dispatch("notify", {...err, message: "Erro ao fazer download do arquivo", time:4000, type: "warning"})
            }
        },
    },
    getters:{
        getBooksByAuthor: ({arr}) => ({id}) => arr.filter(book => book.author.id === id),
        getBookById: ({arr}) => (id) => arr.find(book => book.id === id)
    }
}