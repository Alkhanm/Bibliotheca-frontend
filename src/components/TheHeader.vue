<template>
  <div>
    <v-toolbar dark>
      <v-toolbar-title>
        <h1
          @click="$router.go({ name: 'Listas' })"
          class="title text-uppercase"
        >
          Bibliotheca
        </h1>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <h3 class="text-capitalize mr-3">{{ getUsername }}</h3>

      <v-btn small icon @click="signout()">
        <v-icon>input</v-icon> 
      </v-btn>
    </v-toolbar>
  </div>
</template>
<script>
import { mapMutations, mapActions, mapGetters } from "vuex";
export default {
  name: "TheHeader",
  data: () => ({
    icons: {
      logout : "src/assets/input.svg"
    }
  }),
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
.title {
  user-select: none;
}
.title:hover {
  cursor: pointer;
  opacity: 0.9;
}

.header-card {
  display: flex;
  flex-direction: column;
}
</style>