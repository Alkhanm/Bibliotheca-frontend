<template>
  <v-card-actions>
    <v-btn @click="$router.back()" color="grey darken-3">
      <v-icon>keyboard_return</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    <v-menu
      :close-on-content-click="false"
      offset-y
      bottom
      transition="slide-y-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="grey darken-3" dark v-bind="attrs" v-on="on">
          <v-icon>view_headline</v-icon>
        </v-btn>
      </template>
      <v-card id="actions" dark>
        <v-list class="grey darken-3">
          <v-subheader>Opções dos livros</v-subheader>
          <v-list-item>
            <v-list-item-title class="mr-2">Adicionar livro</v-list-item-title>
            <BookNew v-bind="{ author }"></BookNew>
          </v-list-item>
          <v-list-item>
            <v-list-item-title> Ordenar livros </v-list-item-title>
            <v-menu :close-on-content-click="false">
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" text>
                  <v-icon>list</v-icon>
                </v-btn>
              </template>
              <v-list dense dark rounded class="grey darken-2 text-white">
                <v-list-item-title>Ordenar por:</v-list-item-title>
                <v-radio-group v-model="order.type" class="pb-2">
                  <v-radio label="Título" value="title" />
                  <v-radio label="Série" value="serie" />
                  <v-radio label="Mais recentes" value="lastRead" />
                  <v-radio label="Status da leitura" value="status" />
                  <v-radio label="Padrão" value="id" />
                </v-radio-group>
                <v-divider></v-divider>
                <v-btn
                  @click="order.reverse = false"
                  class="grey darken-2"
                  width="50%"
                  text
                >
                  <v-icon :color="!order.reverse ? 'info' : ''"
                    >arrow_circle_down</v-icon
                  >
                </v-btn>
                <v-btn
                  @click="order.reverse = true"
                  class="grey darken-2"
                  width="50%"
                  text
                >
                  <v-icon :color="order.reverse ? 'info' : ''"
                    >arrow_circle_up</v-icon
                  >
                </v-btn>
              </v-list>
            </v-menu>
          </v-list-item>
          <v-subheader>Opções do autor</v-subheader>
          <v-list-item>
            <v-list-item-title class="mr-2">Excluir</v-list-item-title>
            <ConfirmDelete :callback="remove"></ConfirmDelete>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </v-card-actions>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import BookNew from "./BookNew";
import ConfirmDelete from "./ConfirmDelete";

export default {
  name: "AuthorActions",
  components: { BookNew, ConfirmDelete },
  props: { author: { type: Object, requerid: true } },
  computed: {
    order: {
      get(){
        return this.$store.state.book.order;
      },
      set(value){
        this.$store.commit("addOrderBook", value)
      }
    }
  },
  methods: {
    ...mapMutations(["requestConfirmation"]),
    ...mapActions(["deleteAuthor"]),
    async remove() {
      this.$emit("loading", true);
      await this.deleteAuthor(this.author);
      this.$router.go({ name: "Listas" });
    },
  },
};
</script>

<style scoped>
</style>