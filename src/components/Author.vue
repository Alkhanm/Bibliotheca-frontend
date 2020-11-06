<template>
  <v-card
    id="author"
    :loading="loadingAuthor"
    dark
    class="mx-auto grey darken-4"
    max-width="1000"
  >
    <v-card-title>
      <span class="text-capitalize text-right">{{ author.name }}</span>
    </v-card-title>
    <v-card-subtitle class="text-capitalize">
      {{ list }}
    </v-card-subtitle>
    <AuthorActions @loading="loading = $event" :author="author"></AuthorActions>
    <v-divider></v-divider>
    <v-card-text>
      <h1 class="text-center mb-3 subtitle-1">
        Livros de {{ author.name }}
        <div v-if="loadingAuthor">
          <v-btn text fab loading></v-btn>
          <p class="subtitle-2">Buscando arquivos...</p>
        </div>
      </h1>
      <template v-if="books.length">
        <transition-group tag="div" name="flip-list" class="books-container">
          <BookPreview
            v-for="book in books"
            :key="book.id"
            :book="book"
            @loading="loading = $event"
          ></BookPreview>
        </transition-group>
      </template>
      <h2 class="text-center subtitle-2" v-else>
        Os Livros adicionados aparecerão aqui.
      </h2>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { sort } from "@/services/utils";
import BookPreview from "./BookPreview";
import AuthorActions from "./AuthorActions";

export default {
  name: "Author",
  props: { id: { type: Number, required: false } },
  components: { BookPreview, AuthorActions },
  data: () => ({
    loading: false,
    loadingAuthor: true,
  }),
  computed: {
    ...mapGetters(["getAuthorById", "getBooksByAuthor"]),
    author() {
      return this.getAuthorById(this.id);
    },
    list() {
      return this.author.readingList.name;
    },
    order() {
      return this.$store.state.book.order;
    },
    books() {
      const books = this.getBooksByAuthor(this.author);
      const orderedBooks = sort(books, this.order.type);
      if (this.order.reverse) return orderedBooks.reverse();
      return orderedBooks;
    },
  },
  methods: mapActions(["fetchBooks"]),
  async mounted() {
    if (!this.author) this.$router.push({ path: "/menu" });
    if (!this.books.length) await this.fetchBooks(this.author);
    this.loadingAuthor = false
  },
};
</script>

<style scoped>
.books-container {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}
</style>