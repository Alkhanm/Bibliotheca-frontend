<template>
  <v-container>
    <v-card id="author" dark class="mx-auto grey darken-4" max-width="1000">
      <v-card-title>
        <span class="text-capitalize text-right">{{ author.name }}</span>
      </v-card-title>
      <v-card-subtitle class="text-capitalize">
        {{ author.list.name }}
      </v-card-subtitle>
      <AuthorActions></AuthorActions>
      <v-divider></v-divider>
      <h1 class="text-center mt-3 subtitle-1">Livros de {{ author.name }}</h1>
      <v-card-text class="books-container">
        <BookPreview
          v-for="book in books"
          :key="book.id"
          :book="book"
        ></BookPreview>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import BookPreview from "./BookPreview";
import AuthorActions from "./AuthorActions"

export default {
  name: "Author",
  components: { BookPreview, AuthorActions },
  data: () => ({}),
  computed: {
    ...mapGetters(["getAuthorById", "getBooksByAuthor"]),
    author() {
      const id = this.$route.params.id;
      return this.getAuthorById(id);
    },
    books() {
      const books = this.getBooksByAuthor(this.author);
      return books;
    },
  },
  created() {
    if (!this.author) this.$router.back();
  },
};
</script>

<style>

.books-container {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}
</style>