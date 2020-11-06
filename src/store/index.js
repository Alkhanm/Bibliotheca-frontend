import Vue from 'vue'
import Vuex from 'vuex'

import * as actions from './actions'
import * as mutations from "./mutations"

import user from './module/user'
import readingList from './module/readingList'
import author from './module/author'
import book from './module/book'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        showMenu: false,
        showConfirmation: false,
        fullScreen: false,
        info: {},
    },
    mutations,
    actions,
    modules: {
        user,
        readingList,
        author,
        book,
    },
})