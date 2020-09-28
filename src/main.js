import 'mutationobserver-shim'
import Vue from 'vue'
import App from './App.vue'

import router from './config/router/index'
import store from './config/store/index'
import vuetify from './plugins/vuetify';

import firebase from 'firebase/app'
import 'firebase/storage'

firebase.initializeApp({
  apiKey: "AIzaSyDlFqaoVu3pG3MItPVbiI3Q2bYRprPLwQ8",
  authDomain: "libros-b54df.firebaseapp.com",
  databaseURL: "https://libros-b54df.firebaseio.com",
  projectId: "libros-b54df",
  storageBucket: "libros-b54df.appspot.com",
  messagingSenderId: "483934958018",
  appId: "1:483934958018:web:b27d4be00c7fe999e3e65b",
  measurementId: "G-QTXHPGR6R0"
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')