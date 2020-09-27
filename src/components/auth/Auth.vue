<template>
  <v-container>
    <v-card class="mx-auto mb-3" dark>
      <v-container fluid>
        <template v-if="isRegistredUser">
          <Login />
        </template>
        <template v-else>
          <Register />
        </template>
        <hr />
        <div class="text-center">
          <v-btn @click="register()" class="mt-4 grey darken-3 text-uppercase" small>{{buttonText}}</v-btn>
        </div>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import Login from "./Login";
import Register from "./Register";
export default {
  name: "Auth",
  components: { Login, Register },
  data() {
    return {
      isRegistredUser: true,
      buttonText: "Criar nova conta",
    };
  },
  computed: {
    info() {
      return this.$store.state.info;
    },
  },
  methods: {
    register() {
      this.isRegistredUser = !this.isRegistredUser;
      this.buttonText = this.isRegistredUser
        ? "Criar nova conta"
        : "Já possui uma conta?";
    },
  },
};
</script>

<style>
</style>