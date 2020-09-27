<template>
  <v-list id="list-book">
    <v-list-item v-for="book in books" :key="book.id" active-class sub-group>
      <v-icon class="pa-2">book</v-icon>
      <v-list-item-title>{{book.title}}</v-list-item-title>
      <v-btn :to="{name:'Livraria', params: {id: book.id} }">abrir</v-btn>
    </v-list-item>
    <v-list-item v-if="!books.length">
      <v-list-item-content>
        <v-alert type="info" text>Por enquanto não há nada nesta lista.</v-alert>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "ListBook",
  props: {
    author: { type: Object, required: true },
  },
  data: () => ({}),
  computed: {
    ...mapGetters(["getBooksByAuthor"]),
    books() {
      return this.getBooksByAuthor(this.author);
    },
  },
  methods: mapActions(["fetchBooks"]),
  async mounted() {
    const books = this.getBooksByAuthor(this.author);
    if (!books.length) await this.fetchBooks(this.author);
  },
};
</script>

<style>
</style>