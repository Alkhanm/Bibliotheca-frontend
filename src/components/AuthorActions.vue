<template>
  <v-card-actions>
    <v-btn @click="$router.back()" color="grey darken-3">
      <v-icon>keyboard_return</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    <ConfirmDelete :callback="remove"></ConfirmDelete>
    <v-menu
      :close-on-content-click="false"
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
          <v-subheader>Opções do autor</v-subheader>
          <v-list-item>
            <v-list-item-title>Mudar de lista</v-list-item-title>
            <v-btn text>
              <v-icon title="">create</v-icon>
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="mr-2">Excluir</v-list-item-title>
            <ConfirmDelete :callback="remove"></ConfirmDelete>
          </v-list-item>
          <v-subheader>Opções dos livros</v-subheader>
          <v-list-item>
            <v-list-item-title class="mr-2">Adicionar livro</v-list-item-title>
            <BookNew v-bind="{ author }" ></BookNew>
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
  props: {
    author: {
      type: Object,
      requerid: true,
    },
  },
  methods: {
    ...mapMutations(["requestConfirmation"]),
    ...mapActions(["deleteAuthor"]),
    async remove() {
      this.$emit("loading", true)
      await this.deleteAuthor(this.author);
      this.$router.go({name: "Listas"});
      this.$emit("loading", false)
    },
  },
};
</script>

<style>
</style>