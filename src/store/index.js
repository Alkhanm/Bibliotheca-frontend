import Vue from 'vue'
import Vuex from 'vuex'

import * as actions from './actions'

import user from './module/user'
import list from './module/list'
import author from './module/author'
import book from './module/book'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showMenu: false,
    open: false,
    info: '',
  },
  mutations: {
    displayMenu(state, payload) {
      if (state.user.username) state.showMenu = payload
    },
    inform(state, info) {
      state.info = info
    },
    openBook(state, payload){
      state.open = payload
    },
  },
  actions,
  modules: {
    user,
    list,
    author,
    book,
  },
})
