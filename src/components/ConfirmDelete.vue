<template>
  <v-dialog v-model="open" dark persistent max-width="300">
    <template v-slot:activator="{ on, attrs }">
      <v-btn text v-on="on" v-bind="attrs">
        <v-icon>delete</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline-2"> Você tem certeza? </v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-3" width="45%" @click="accept()"> Sim </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-3" width="45%" @click="reject()"> Não </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
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
  data: () => ({
    open: false,
  }),
  methods: {
    async accept() {
      this.open = false;
      await this.callback();
    },
    reject() {
      this.open = false;
    },
  },
};
</script>