<template>
  <div>
    <v-toolbar dark>
      <v-toolbar-title>
        <h1
          @click="$router.push({ path: '/menu' })"
          class="title text-uppercase"
        >
          Bibliotheca
        </h1>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <h3 class="text-capitalize mr-3">{{ username }}</h3>
      <v-btn small icon @click="signout()">
        <v-icon>input</v-icon>
      </v-btn>
    </v-toolbar>
  </div>
</template>
<script>
import { mapMutations, mapActions } from "vuex";
export default {
  name: "TheHeader",
  computed: {
    menuIsVisible() {
      return this.$store.state.showMenu;
    },
    username(){
      return this.$store.state.user.username
    }
  },
  methods: {
    ...mapMutations(["displayMenu"]),
    ...mapActions(["signout"]),
  },
};
</script>