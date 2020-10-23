<template>
  <v-card max-width="1000px" class="grey darken-3 mx-auto">
    <v-card dark>
      <v-card-actions class="actions">
        <v-menu
          :close-on-content-click="false"
          allow-overflow
          offset-y
          bottom
          transition="slide-y-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="grey darken-3" dark v-bind="attrs" v-on="on">
              <v-icon>view_headline </v-icon>
            </v-btn>
          </template>
          <v-card id="actions" dark>
            <v-list class="grey darken-3">
              <v-subheader>Opções de leitura</v-subheader>
              <v-list-item>
                <v-list-item-title> Nova Lista </v-list-item-title>
                <ListNew />
              </v-list-item>
              <v-list-item>
                <v-list-item-title> Ordenar Lista </v-list-item-title>
                <v-menu>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" text>
                      <v-icon>list</v-icon>
                    </v-btn>
                  </template>
                  <v-list dense dark rounded class="grey darken-2">
                    <v-list-item-group>
                      <v-radio-group v-model="orderBy">
                        <v-radio value="name" label="Por nome" />
                        <v-radio value="startDate" label="Por data" />
                        <v-radio value="id" label="Padrão" />
                        <v-radio label="Manual (indisponivel)" disabled />
                      </v-radio-group>
                      <v-divider></v-divider>
                      <v-btn @click="reverseOrder = false" width="50%" text>
                        <v-icon>arrow_circle_down</v-icon>
                      </v-btn>
                      <v-btn @click="reverseOrder = true" width="50%" text>
                        <v-icon>arrow_circle_up</v-icon>
                      </v-btn>
                    </v-list-item-group>
                  </v-list>
                </v-menu>
              </v-list-item>
              <v-subheader>Opções do site</v-subheader>
              <v-list-item>
                <v-list-item-title class="mr-2">
                  Modo tela cheia
                </v-list-item-title>
                <v-btn @click="togleFullScreeen()" text>
                  <v-icon>fullscreen</v-icon>
                </v-btn>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
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
    <transition-group name="flip-list">
      <List
        @searchFor="search = $event"
        v-for="list in filtredList"
        :key="list.id"
        :list="list"
        class="mt-2"
      >
      </List>
    </transition-group>
    <v-btn v-if="loading" block loading text></v-btn>
    <v-alert text dense dark v-else-if="!lists.length">
      Nenhuma lista foi salva ainda
    </v-alert>
  </v-card>
</template>

<script>
import BookLatest from "./BooksLatest";
import List from "@/components/List";
import ListNew from "@/components/ListNew";
import formatText from "@/services/replace";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Menu",
  components: { ListNew, List, BookLatest },
  data: () => ({
    search: "",
    loading: true,
    orderBy: "id",
    reverseOrder: false,
  }),
  computed: {
    ...mapGetters(["getOrderedList"]),
    lists() {
      const lists = this.getOrderedList(this.orderBy);
      if (this.reverseOrder) return lists.reverse();
      return lists;
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
    togleFullScreeen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        this.$store.commit("openFullScreen", true);
        this.$store.commit("inform", {
          message: "Você está em modo tela cheia.",
          type: "info",
          actionName: "Sair",
          callback: this.togleFullScreeen,
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          this.$store.commit("openFullScreen", false);
        }
      }
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
.flip-list-move {
  transition: transform 1s;
}
</style>

