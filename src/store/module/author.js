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
            try {
                const response = await http.get(AUTHOR.URL, { params: { list: list.id } })
                const author = response.data
                commit("addAllAuthors", author)
            }
            catch (err) {
                console.error(err)
                commit("inform", err.response.data)
            }
        },
        async saveAuthor({ commit, getters }, author) {
            const authors = getters.getAuthorsByList(author.list)
            const exists = authors
                .some(a => a.name.toUpperCase() === author.name.toUpperCase())
            if (exists) return commit("inform",
                { message: "Essa coleção já possui um livro de mesmo titulo", type: "warning" })
            try {
                const response = await http.post(AUTHOR.URL, author)
                const newAuthor = response.data
                commit("addAuthor", newAuthor)
                return newAuthor
            } catch (err) {
                console.error(err)
                commit("inform", err.response.data)
            }
        },
        async deleteAuthor({ commit, rootGetters }, author) {
            try {
                await http.delete(`${AUTHOR.URL}/${author.id}`)
                commit("removeAuthor", author)
                //Pega o caminho para a pasta que contém todos os livros desse autor e a apaga
                const book = rootGetters.getBooksByAuthor(author).find(book => book.path != null)
                if (!book) return;
                const bookPath = book.path.split("/")
                //Caminho no storage para os livros desse autor
                const path = bookPath.slice(0, bookPath.length - 1).join("/")
                deleteArchives(path)
            } catch (err) {
                console.error(err)
                commit("inform", err.response.data)
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