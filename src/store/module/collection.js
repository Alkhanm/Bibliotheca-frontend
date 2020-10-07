import http from '@/services/api/axios'
import { COLLECTION } from "@/services/api/url"
export default {
    state: {
        arr: [],
    },
    mutations: {
        newCollection(state, payload){ state.create = payload },
        addAllCollections(state, collections){ state.arr.push(...collections) },
        addCollection(state, collection){ state.arr.push(collection) },
        removeCollection({ arr }, { id }) {
            const collection = arr.find(collection => collection.id === id)
            arr.splice(arr.indexOf(collection), 1)
        }
    },
    actions: {
        async fetchCollections({commit}, list){
            const response = await http.get(COLLECTION.URL, {params: {list: list.id}})
            const collections = response.data
            commit("addAllCollections", collections)
        },
        async saveCollection({commit}, collection){
            const response = await http.post(COLLECTION.URL, collection)
            const newCollection = response.data
            commit("addCollection", newCollection)
        }, 
        async deleteCollection({commit, dispatch}, collection ){
            try {
                await http.delete(`${COLLECTION.URL}/${collection.id}`)
                commit("removeCollection", collection)
            } catch(err){
                dispatch("notify", {...err, time: 5000})
            }
        },
    },
    getters:{
        getCollectionsByList: ({ arr }) => ({id}) => arr.filter(collection => collection.list.id === id),
        getCollectionById: ({ arr }) => (id) => arr.find(collection => collection.id === id )
    }
}