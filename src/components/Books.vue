<template>
  <v-list id="list-book">
    <v-list-item v-for="book in books" :key="book.id" sub-group class="mr-5 ml-5">
      <v-icon class="ma-2">book</v-icon>
      <v-list-item-title>{{ book.title }}</v-list-item-title>
      <v-btn :to="{ name:'Leitura', params: { id: book.id } }">abrir</v-btn>
    </v-list-item>
    <v-list-item v-if="loading">
      <v-btn text loading block></v-btn>
    </v-list-item>
    <v-list-item v-else-if="!hasBooks">
      <v-list-item-content>
        <v-alert type="info" text>Por enquanto não há nada nesta lista.</v-alert>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Books",
  props: {
    author: { type: Object, required: true },
  },
  data: () => ({ loading: true }),
  computed: {
    ...mapGetters(["getBooksByAuthor"]),
    books() {
      return this.getBooksByAuthor(this.author);
    },
    hasBooks(){
      return !!this.books.length
    }
  },
  methods: mapActions(["fetchBooks"]),
  async mounted() {
    if (!this.books.length) await this.fetchBooks(this.author);
    this.loading = false;
  },
};
</script>
