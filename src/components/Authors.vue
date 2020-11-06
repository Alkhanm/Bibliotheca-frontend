<template>
  <v-list>
    <v-list-group v-for="author in author" :key="author.id" ripple no-action>
      <template v-slot:activator>
        <v-btn
          fab
          small
          depressed
          :to="{ name: 'Autor', params: { id: author.id } }"
          class="mr-2 grey darken-4"
        >
          <v-icon>collections_bookmark</v-icon>
        </v-btn>
        <v-list-item-title v-text="author.name" class="text-capitalize" />
      </template>

      <template v-slot:appendIcon>
        <v-icon>expand_more</v-icon>
      </template>

      <Books :author="author"></Books>
    </v-list-group>
    <v-list-item v-if="loading">
      <v-btn loading block text></v-btn>
    </v-list-item>
    <v-list-item v-else-if="!author.length">
      <v-list-item-content>
        <v-alert text>Nenhum livro adicionado</v-alert>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import Books from "@/components/Books";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "ListAuthor",
  components: { Books },
  props: { readingList: { type: Object, required: true } },
  data: () => ({ loading: true }),
  computed: {
    ...mapGetters(["getAuthorsByList"]),
    author() {
      return this.getAuthorsByList(this.readingList);
    },
  },
  methods: mapActions(["fetchAuthors", "deleteAuthor"]),
  async mounted() {
    if (!this.author.length) await this.fetchAuthors(this.readingList);
    this.loading = false;
  },
};
</script>

<style scoped>
</style>

