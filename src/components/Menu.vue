<template>
  <v-container fluid>
    <v-card max-width="1000px" class="grey darken-2 mx-auto">
      <v-card dark>
        <v-card-actions>
          <v-btn @click="newList()" class="grey darken-2">
            <v-icon :color="create ? 'success': 'info'">library_add</v-icon>Nova
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
          />
          <v-spacer></v-spacer>
        </v-card-actions>
        <v-card-text v-show="search" class="text-center">
          <span class="subtitle-1">
            <strong>Resultados:</strong>
            {{filtredList.length}} de {{lists.length}}
          </span>
        </v-card-text>
      </v-card>
      <NewList v-show="create" />
      <ReadingList
        @searchFor="search = $event"
        v-for="list in filtredList"
        :key="list.id"
        :list="list"
        class="mt-7"
      />
    </v-card>
    <v-alert class="mt-4" v-show="!lists.length" text type="info">
      Nenhuma lista salva.
      <br />Clique no botão acima para adicionar a sua próxima lista de leitura :D
    </v-alert>
  </v-container>
</template>

<script>
import ReadingList from "@/components/list/ReadingList";
import NewList from "@/components/list/NewList";
import formatText from "@/config/util/replace";
export default {
  name: "Menu",
  components: { NewList, ReadingList },
  data() {
    return {
      search: "",
    };
  },
  computed: {
    create() {
      return this.$store.state.list.create;
    },
    lists() {
      return this.$store.state.list.arr;
    },
    filtredList() {
      const search = formatText(this.search);
      if (search) {
        const filter = this.lists.filter((list) => {
          const name = formatText(list.name);
          const categories = list.categories.filter((c) =>
            formatText(c).includes(search)
          );
          return name.includes(search) || categories.length;
        });
        return filter;
      }
      return this.lists;
    },
  },
  methods: {
    newList() {
      this.$store.commit("createList", !this.create);
    },
  },
  created() {
    this.$store.dispatch("fetchList");
  },
};
</script>

<style>
#menu-action {
  position: fixed;
  z-index: 4;
}
</style>

