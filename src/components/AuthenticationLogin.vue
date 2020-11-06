<template>
  <v-form valid="true">
    <h2 class="text-center text-capitalize">Faça login</h2>
    <v-text-field
      v-model="user.username"
      label="Nome de usuario ou email"
      hint="Informe o nome do usuário."
    />
    <v-text-field
      v-model="user.password"
      label="Senha"
      class="input-group--focused"
      counter
      :type="showPswd ? 'text' : 'password'"
      append-icon="remove_red_eye"
      @click:append="showPswd = !showPswd"
    />
    <div class="text-center">
      <v-btn
        @click="signin(user)"
        :disabled="!user.password || !user.username"
        block
        class="mb-4 grey darken-3"
      >Entrar</v-btn>
    </div>
  </v-form>
</template>
<script>
import { mapActions } from 'vuex';
export default {
  name: "Auth",
  data: () => ({ showPswd: false, user: {}}),
  methods: mapActions(["signin"]),
};
</script>

