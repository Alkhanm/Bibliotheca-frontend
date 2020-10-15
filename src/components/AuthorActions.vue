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
          <v-subheader>Opções</v-subheader>
          <v-list-item>
            <v-list-item-title>opção 1</v-list-item-title>
            <v-btn text>
              <v-icon title="">menu_book</v-icon>
            </v-btn>
          </v-list-item>
          <v-list-item>
           <v-list-item-title>opção 1</v-list-item-title>
            <v-btn text>
              <v-icon title="">menu_book</v-icon>
            </v-btn>
          </v-list-item>
          <v-subheader>Opções 2</v-subheader>
          <v-list-item>
            <v-list-item-title class="mr-2">Excluir</v-list-item-title>
            <v-btn append text>
              <v-icon>delete</v-icon>
            </v-btn>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </v-card-actions>
</template>

<script>

export default {
  name: "AuthorActions",

};
</script>

<style>
</style>