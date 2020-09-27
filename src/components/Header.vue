<template>
  <div>
    <v-toolbar dark>
      <v-toolbar-title>
        <h2 @click="$router.go({name: 'Listas'})" class="header-title text-uppercase">Libros</h2>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <h3 class="text-capitalize">{{getUsername}}</h3>

      <v-btn icon @click="signout()">
        <v-icon>mdi-export</v-icon>
      </v-btn>
    </v-toolbar>
  </div>
</template>
<script>
/* eslint-disable vue/no-unused-components */
import { mapMutations, mapActions, mapGetters } from "vuex";
export default {
  name: "Header",
  props: ["page"],
  computed: {
    ...mapGetters(["getUsername"]),
    menuIsVisible() {
      return this.$store.state.showMenu;
    },
  },
  methods: {
    ...mapMutations(["displayMenu"]),
    ...mapActions(["signout"]),
  },
};
</script>
<style>
.header-card {
  display: flex;
  flex-direction: column;
}
h2:hover {
  cursor: pointer;
  opacity: 0.7;
}
</style>