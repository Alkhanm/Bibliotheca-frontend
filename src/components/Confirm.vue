<template>
  <v-row justify="center">
    <v-dialog v-model="open" dark persistent max-width="300">
      <v-card>
        <v-card-title class="headline-2"> Você tem certeza? </v-card-title>
        <v-card-text>{{ message }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-3" width="45%" @click="accept()">
            Sim
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-3" width="45%" @click="reject()">
            Não
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  props: {
    callback: {
      type: Function,
      required: true,
    },
    message: {
      type: String,
      required: false,
      default: "Essa ação não é reversivel.",
    },
  },
  computed: {
    open() {
      return this.$store.state.showConfirmation;
    },
  },
  methods: {
    ...mapMutations(["requestConfirmation"]),
    async accept() {
      this.requestConfirmation(false);
      await this.callback();
    },
    reject() {
      this.requestConfirmation(false);
    },
  },
};
</script>