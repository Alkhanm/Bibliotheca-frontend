<template>
  <v-container>
    <v-card class="mx-auto mb-3" max-width="1000" dark>
      <v-container fluid>
        <template v-if="isRegistredUser">
          <AuthenticationLogin />
        </template>
        <template v-else>
          <AuthenticationRegister @registred="isRegistredUser = true" />
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
import AuthenticationLogin from "./AuthenticationLogin";
import AuthenticationRegister from "./AuthenticationRegister";
export default {
  name: "Auth",
  components: { AuthenticationLogin, AuthenticationRegister },
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
