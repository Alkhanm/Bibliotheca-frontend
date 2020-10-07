<template>
  <v-list>
    <v-btn v-if="loading" block loading></v-btn>
    <v-list-group prepend-icon="account_circle" v-for="(collection) in collections" :key="collection.id">
      <template v-slot:activator>
        <v-list-item-title v-text="collection.name" />
      </template>
      <v-list-item class="actions">
        <BookNew :collection="collection"></BookNew>
        <v-spacer></v-spacer>
        <v-btn @click="deleteCollection(collection)" small fab class="ml-3 grey darken-3">
          <v-icon color="red">delete</v-icon>
        </v-btn>
      </v-list-item>
      <Books :collection="collection"></Books>
    </v-list-group>
    <v-list-item v-if="loading">
      <v-btn loading block text></v-btn>
    </v-list-item>
    <v-list-item v-else-if="!collections.length">
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
  name: "ListCollection",
  components: { Books, BookNew },
  props: { list: { type: Object, required: true } },
  data: () => ({ loading: true }),
  computed: {
    ...mapGetters(["getCollectionsByList"]),
    collections() {
      return this.getCollectionsByList(this.list);
    },
  },
  methods: mapActions(["fetchCollections", "deleteCollection"]),
  async mounted() {
    if (!this.collections.length) await this.fetchCollections(this.list);
    this.loading = false;
  },
};
</script>

<style>
</style>
