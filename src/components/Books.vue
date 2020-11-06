<template>
  <v-list-item-group id="list-book">
    <v-list-item
      id="list-item-book"
      v-for="book in books"
      :key="book.id"
      sub-group
      :to="{ name: 'Leitura', params: { id: book.id } }"
    >
      <v-icon>book</v-icon>
      <v-list-item-title class="ml-2">
        {{ book.title }}
      </v-list-item-title>
    </v-list-item>
    <v-list-item v-if="loading">
      <v-btn text loading block></v-btn>
    </v-list-item>
    <v-list-item v-else-if="!hasBooks">
      <v-list-item-content>
        <v-alert type="info" text
          >Por enquanto não há nada nesta lista.</v-alert
        >
      </v-list-item-content>
    </v-list-item>
  </v-list-item-group>
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
    hasBooks() {
      return !!this.books.length;
    },
  },
  methods: mapActions(["fetchBooks"]),
  async mounted() {
    if (!this.books.length) await this.fetchBooks(this.author);
    this.loading = false;
  },
};
</script>

<style scoped>
#list-item-book{
  margin-left: 2%;
}
</style>