<template>
  <v-card dark class="mx-auto">
    <v-card-title class="font-weight-regular justify-space-between">
      <span class="text-uppercase">{{ list.name }}</span>
      <v-menu left offset-x>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            <v-icon>menu</v-icon>
          </v-btn>
        </template>
        <v-card dark >
          <BookNew v-bind="{ list }">
            <v-btn slot="button-to-open"></v-btn>
          </BookNew>
          <v-btn class="ml-1 mr-1" @click="deleteList(list)" text>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-card>
      </v-menu>
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
    <v-window v-model="step">
      <v-window-item :value="1">
        <v-card-text class="text-info">
          <div>{{ list.description }}</div>
          <div class="text-right">Iniciada em: {{ list.startDate }}</div>
        </v-card-text>
      </v-window-item>
      <v-window-item eager :value="2">
        <v-spacer></v-spacer>
        <Authors :list="list"></Authors>
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
import Authors from "@/components/Authors";
import BookNew from "./BookNew";
import { mapActions } from "vuex";

export default {
  name: "Section",
  components: { Authors, BookNew },
  props: { list: { type: Object, requerid: true } },
  data: () => ({
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
    searchFor(cat) {
      this.$emit("searchFor", cat);
    },
  },
};
</script>
<style>
.actions-list {
  display: flex;
  flex-direction: row;
}
</style>