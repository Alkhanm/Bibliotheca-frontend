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
            <v-btn @click="remove()" text>
              <v-icon>delete</v-icon>
            </v-btn>
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
import { mapActions } from "vuex";
import BookNew from "./BookNew";
export default {
  name: "AuthorActions",
  components: { BookNew },
  props: {
    author: {
      type: Object,
      requerid: true,
    },
  },
  data: () => ({}),
  methods: {
    ...mapActions(["deleteAuthor"]),
    async remove() {
      this.$emit("loading", true)
      await this.deleteAuthor(this.author);
      this.$emit("loading", false)
      setInterval(() => {
        this.$router.go({name: "Listas"});
      }, 2000)
    },
  },
};
</script>

<style>
</style>