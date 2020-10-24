<template>
    <v-card
      id="author"
      :loading="loading"
      dark
      class="mx-auto grey darken-4"
      max-width="1000"
    >
      <v-card-title>
        <span class="text-capitalize text-right">{{ author.name }}</span>
      </v-card-title>
      <v-card-subtitle class="text-capitalize">
        {{ author.list.name }}
      </v-card-subtitle>
      <AuthorActions @loading="loading = $event" :author="author"></AuthorActions>
      <v-divider></v-divider>
      <v-card-text>
        <h1 class="text-center mb-3 subtitle-1">Livros de {{ author.name }}</h1>
        <template v-if="books.length">
          <div class="books-container">
            <BookPreview
              v-for="book in books"
              :key="book.id"
              :book="book"
              @loading="loading = $event"
            ></BookPreview>
          </div>
        </template>
        <h2 class="text-center subtitle-2" v-else>
          Os Livros adicionados aparecerão aqui.
        </h2>
      </v-card-text>
    </v-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import BookPreview from "./BookPreview";
import AuthorActions from "./AuthorActions";

export default {
  name: "Author",
  props: { id: { type: Number, required: false }},
  components: { BookPreview, AuthorActions },
  data: () => ({
    loading: false,
  }),
  computed: {
    ...mapGetters(["getAuthorById", "getBooksByAuthor"]),
    author() {
      return this.getAuthorById(this.id);
    },
    books() {
      return this.getBooksByAuthor(this.author);
    },
  },
  methods: mapActions(["fetchBooks"]),
  async mounted() {
    if (!this.author) this.$router.push({ path: "/menu" });
    if (!this.books.length) this.fetchBooks(this.author);
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