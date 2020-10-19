import http from '@/services/api/axios'
import { AUTHOR } from "@/services/api/url"
import { deleteArchives } from "@/services/storage"

export default {
    state: {
        arr: [],
        create: false,
    },
    mutations: {
        newAuthor(state, value) { state.create = value },
        addAllAuthors({ arr }, author) { arr.push(...author) },
        addAuthor({ arr }, author) { arr.push(author) },
        removeAuthor({ arr }, { id }) {
            const author = arr.find(author => author.id === id)
            arr.splice(arr.indexOf(author), 1)
        },
        removeAuthorsByList({ arr }, list) {
            arr.filter(author => author.list.id == list.id)
                .forEach(author => arr.splice(arr.indexOf(author), 1))
        }
    },
    actions: {
        async fetchAuthors({ commit }, list) {
            const response = await http.get(AUTHOR.URL, { params: { list: list.id } })
            const author = response.data
            commit("addAllAuthors", author)
        },
        async saveAuthor({ commit }, author) {
            const response = await http.post(AUTHOR.URL, author)
            const newAuthor = response.data
            commit("addAuthor", newAuthor)
            return newAuthor
        },
        async deleteAuthor({ commit, dispatch, rootState }, author) {
            try {
                //Caminho no storage do livro atual
                //Pega o caminho para a pasta que contém todos os livros desse autor e a apaga
                const bookPath = rootState.book.currentBook.path.split("/")
                const path = bookPath.slice(0, bookPath.length - 1).join("/")
                if (bookPath.length) await deleteArchives(path)
                await http.delete(`${AUTHOR.URL}/${author.id}`)
                commit("removeAuthor", author)
            } catch (err) {
                console.error(err)
                dispatch("notify", { ...err, time: 5000 })
            }
        },
    },
    getters: {
        getAuthorsByList: ({ arr }) => ({ id }) =>
            arr.filter(author => author.list.id === id),

        getAuthorById: ({ arr }) => (id) =>
            arr.find(author => author.id === id),

        getAuthorByName: ({ arr }) => (name) =>
            arr.find(a => {
                const author = a.name.toUpperCase().trim().replaceAll(" ", "")
                const authorName = name.toUpperCase().trim().replaceAll(" ", "")
                if (author === authorName) return author
            }),

    }
}