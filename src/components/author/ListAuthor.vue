<template>
  <v-list flat>
    <v-btn v-if="loading" block loading></v-btn>
    <v-list-group prepend-icon="account_circle" v-for="author in authors" :key="author.id">
      <template v-slot:activator>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title v-text="author.name" />
          </v-list-item-content>
        </v-list-item>
      </template>
      <v-list-item class="actions">
        <NewBook :author="author"></NewBook>
        <v-spacer></v-spacer>
        <v-btn @click="deleteAuthor(author)" small fab class="ml-3 grey darken-3">
          <v-icon color="red">delete</v-icon>
        </v-btn>
      </v-list-item>
      <ListBook :author="author"></ListBook>
    </v-list-group>
    <v-list-item v-if="!authors.length">
      <v-list-item-content>
        <v-alert text type="info">Nenhum autor adicionado</v-alert>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import ListBook from "@/components/book/ListBook";
import { mapActions, mapGetters } from "vuex";
import NewBook from "@/components/book/NewBook";

export default {
  name: "ListAuthor",
  components: { ListBook, NewBook },
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