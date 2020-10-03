<template>
  <v-menu 
    :close-on-content-click="false"
    offset-y
    left
    transition="slide-y-transition">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="grey darken-3" dark v-bind="attrs" v-on="on">
        <v-icon>view_headline </v-icon>
      </v-btn>
    </template>
    <v-card id="actions" dark>
      <v-list class="grey darken-3">
        <v-subheader>Opções de leitura</v-subheader>
        <v-list-item>
          <v-list-item-title>Ler</v-list-item-title>
          <v-btn @click="openBook(true)" :disabled="!hasPDF" text>
            <v-icon title="">menu_book</v-icon>
          </v-btn>
        </v-list-item>
        <v-list-item>
          <v-list-item-title class="mr-2">Marcar como lido</v-list-item-title>
          <v-btn text>
            <v-icon title="">library_add_check</v-icon>
          </v-btn>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Adicionar descrição</v-list-item-title>
          <v-btn text>
            <v-icon>notes</v-icon>
          </v-btn>
        </v-list-item>
        <v-list-item>
          <v-list-item-title class="mr-2">Mudar de lista</v-list-item-title>
          <v-btn append text>
            <v-icon>library_books</v-icon>
          </v-btn>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list class="grey darken-3">
        <v-subheader>Opções do livro</v-subheader>
        <v-list-item>
          <v-list-item-title class="mr-2">Alterar/adicionar arquivo</v-list-item-title>
          <v-btn append text>
            <v-icon>picture_as_pdf</v-icon>
          </v-btn>
        </v-list-item>
        <v-list-item>
          <v-list-item-title class="mr-2">Excluir</v-list-item-title>
          <v-btn append text>
            <v-icon>delete</v-icon>
          </v-btn>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "BookActions",
  props: { book: { type: Object, requerid: true} },
  computed: {
    hasPDF(){ return !!this.book.path }
  },
  methods: {
    ...mapMutations(["openBook"]),
  }
};
</script>

<style>
</style>