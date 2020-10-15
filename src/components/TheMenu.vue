<template>
  <v-container fluid>
    <v-card max-width="1000px" class="grey darken-2 mx-auto">
        <v-card dark>
          <v-card-actions>
            <v-btn @click="newList()" class="grey darken-2">
              <v-icon :color="create ? 'success' : 'info'">library_add</v-icon
              >Nova
            </v-btn>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              clearable
              dense
              single-line
              prepend-icon="search"
              hint="Buscar listas por nome ou categoria"
              label="Pesquisar lista"
              class="pa-3"
            />
            <v-spacer></v-spacer>
            <BookLatest></BookLatest>
          </v-card-actions>
          <v-card-text v-show="search" class="text-center">
            <span class="subtitle-1">
              <strong>Resultados:</strong>
              {{ filtredList.length }} de {{ lists.length }}
            </span>
          </v-card-text>
        </v-card>
      <ListNew v-show="create"> </ListNew>

      <List
        @searchFor="search = $event"
        v-for="list in filtredList"
        :key="list.id"
        :list="list"
        class="mt-7"
      >
      </List>
    </v-card>
    <v-btn v-if="loading" block loading text></v-btn>
    <v-alert class="mt-4" v-else-if="!lists.length" text type="info">
      Nenhuma lista foi salva ainda.
    </v-alert>
  </v-container>
</template>

<script>
import BookLatest from "./BooksLatest";
import List from "@/components/List";
import ListNew from "@/components/ListNew";
import formatText from "@/services/replace";
import { mapActions } from "vuex";

export default {
  name: "Menu",
  components: { ListNew, List, BookLatest },
  data: () => ({ search: "", loading: true }),
  computed: {
    create() {
      return this.$store.state.list.create;
    },
    lists() {
      return this.$store.state.list.arr;
    },
    filtredList() {
      const search = formatText(this.search);
      if (!search) return this.lists;
      const filter = this.lists.filter((list) => {
        const name = formatText(list.name);
        const categories = list.categories.filter((c) =>
          formatText(c).includes(search)
        );
        return name.includes(search) || categories.length;
      });
      return filter;
    },
  },
  methods: {
    ...mapActions(["fetchLists"]),
    newList() {
      this.$store.commit("createList", !this.create);
    },
  },
  async mounted() {
    if (!this.lists.length) await this.fetchLists();
    this.loading = false;
  },
};
</script>

<style>
#menu-action {
  position: fixed;
  z-index: 4;
}
.top-menu {
  display: flex;
}

</style>

