<template>
  <v-form v-model="valid">
    <h2 class="text-center text-capitalize">Registrar-se</h2>
    <v-text-field
      v-model="user.username"
      :rules="usernameRules"
      label="Nome de usuario"
      hint="Use o nome do seu personagem favorito! Ou deixe sua imaginação comandar :-)"
    />
    <v-row>
      <v-col>
        <v-text-field
          v-model="user.password"
          :rules="pswdRules"
          label="Senha"
          hint="Defina uma senha forte com mais de 8 caracteres. "
          counter
          :type="showPswd ? 'text' : 'password'"
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="confPassword"
          label="Confirmar senha"
          :rules="confPswdRules"
          counter
          :type="showPswd ? 'text' : 'password'"
          append-icon="remove_red_eye"
          @click:append="showPswd = !showPswd"
        />
      </v-col>
    </v-row>
    <v-text-field
      v-model="user.email"
      :rules="emailRules"
      label="Email"
      hint="Digite uma email para associar a está conta."
      type="email"
    />
    <div class="text-center">
      <v-btn
        @click="register()"
        :loading="loading"
        :disabled="!valid"
        block
        class="mb-4 grey darken-3"
      >Registrar-se</v-btn>
    </div>
  </v-form>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "Auth",
  data() {
    return {
      valid: true,
      loading: false,
      showPswd: false,
      showPswdConf: false,
      user: { username: "", email: "", password: "" },
      confPassword: "",
      pswdRules: [
        (v) => !!v || "Campo obrigatorio",
        (v) => (v && v.length) >= 4 || "Senha muito curta",
      ],
      usernameRules: [
        (v) => !!v || "O nome de usuario é obrigatorio",
        (v) => v.length >= 4 || "Nome muito curto",
      ],
      confPswdRules: [
        (v) => !!v || "Confirme a senha",
        (v) => (!!v && v === this.user.password) || "Senhas não batem",
      ],
      emailRules: [(v) => /.+@.+\..+/.test(v) || "O e-mail deve ser valido"],
    };
  },
  methods: {
    ...mapActions(["saveUser"]),
    async register() {
        this.loading = true;
        const success = await this.saveUser(this.user);
        this.loading = false;
        if (success) this.$emit("registred")
    },
  },
};
</script>

