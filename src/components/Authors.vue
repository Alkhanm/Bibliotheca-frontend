<template>
  <v-list>
    <v-btn v-if="loading" block loading></v-btn>
    <v-list-group prepend-icon="account_circle" v-for="(author) in authors" :key="author.id">
      <template v-slot:activator>
        <v-list-item-title v-text="author.name" />
      </template>
      <v-list-item class="actions">
        <BookNew :author="author"></BookNew>
        <v-spacer></v-spacer>
        <v-btn @click="deleteAuthor(author)" small fab class="ml-3 grey darken-3">
          <v-icon color="red">delete</v-icon>
        </v-btn>
      </v-list-item>
      <Books :author="author"></Books>
    </v-list-group>
    <v-list-item v-if="!authors.length">
      <v-list-item-content>
        <v-alert text type="info">Nenhum autor adicionado</v-alert>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import Books from "@/components/Books";
import BookNew from "@/components/BookNew";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "ListAuthor",
  components: { Books, BookNew },
  props: { list: { type: Object, required: true } },
  data: () => ({ loading: true }),
  computed: {
    ...mapGetters(["getAuthorsByList"]),
    authors() {
      return this.getAuthorsByList(this.list);
    },
  },
  methods: mapActions(["fetchAuthors", "deleteAuthor"]),
  async created() {
    this.loading = true;
    if (!this.authors.length) await this.fetchAuthors(this.list);
    this.loading = false;
  },
};
</script>

<style>
</style>
