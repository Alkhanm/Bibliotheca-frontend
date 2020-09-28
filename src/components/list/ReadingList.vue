<template>
  <v-card dark class="mx-auto">
    <v-card-title class="font-weight-regular justify-space-between">
      <span class="text-uppercase">{{list.name}}</span>
      <v-speed-dial direction="left">
        <template v-slot:activator>
          <v-btn color="grey darken-3" dark small fab>
            <v-icon>menu</v-icon>
          </v-btn>
        </template>
        <v-btn @click="deleteList(list.id)" fab small>
          <v-icon color="red">mdi-delete</v-icon>
        </v-btn>
        <v-btn fab small @click="addAuthor = true">
          <v-icon color="green">mdi-plus</v-icon>
        </v-btn>
      </v-speed-dial>
    </v-card-title>
    <v-card-subtitle>
      <v-chip
        v-for="(cat, i) in categories"
        :key="i"
        @click="searchFor(cat)"
        class="ml-1 mb-1"
        small
        v-text="cat"
      />
    </v-card-subtitle>
    <v-divider></v-divider>
    <v-dialog v-model="addAuthor" max-width="800px">
      <v-card dark>
        <h3 class="mt-2 text-center">Adicionar autor</h3>
        <v-card-actions class="ml-2 mr-2">
          <v-text-field v-model="author.name" clearable autofocus label="Nome do autor" />
          <v-btn @click="newAuthor()" class="ml-4" fab>
            <v-icon color="green">add</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-window v-model="step">
      <v-window-item :value="1">
        <v-card-text class="text-info">
          <div>{{list.description}}</div>
          <div class="text-right">Iniciada em: {{list.startDate}}</div>
        </v-card-text>
      </v-window-item>

      <v-window-item :value="2">
        <v-spacer></v-spacer>

        <ListAuthor :list="list"></ListAuthor>
      </v-window-item>
    </v-window>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn :disabled="step === 1" color="primary" depressed @click="step--">
        <v-icon>arrow_left</v-icon>
        <div>Voltar</div>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn :disabled="step === 2" color="primary" depressed @click="step++">
        <div>Abrir</div>
        <v-icon>arrow_right</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>


<script>
import ListAuthor from "@/components/author/ListAuthor";
import { mapActions } from "vuex";

export default {
  name: "Section",
  components: { ListAuthor },
  props: { list: { type: Object, requerid: true } },
  data: () => ({
    addAuthor: false,
    author: {},
    showActionsPanel: false,
    step: 1,
  }),
  computed: {
    categories() {
      const cat = this.list.categories;
      return cat;
    },
  },
  methods: {
    ...mapActions(["deleteList"]),
    newAuthor() {
      this.author.list = this.list;
      this.$store.dispatch("createAuthor", this.author);
      this.addAuthor = false;
      this.author = {};
    },
    searchFor(cat) {
      this.$emit("searchFor", cat);
    },
  },
};
</script>