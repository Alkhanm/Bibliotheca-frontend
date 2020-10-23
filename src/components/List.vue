<template>
  <v-card dark class="mx-auto" rounded="15%">
    <v-card-text class="text-uppercase list-title pa-md-4 mx-lg-auto">
      <h3 class="title white--text">{{ list.name }}</h3>
      <v-menu class="menu pa-0 mt-0" left offset-x>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            <v-icon>more_horiz</v-icon>
          </v-btn>
        </template>
        <v-card class="mr-2" dark>
          <BookNew v-bind="{ list }"></BookNew>
          <ConfirmDelete :callback="remove"></ConfirmDelete>
        </v-card>
      </v-menu>
    </v-card-text>
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
import ConfirmDelete from "./ConfirmDelete";
import { mapActions, mapMutations } from "vuex";

export default {
  name: "List",
  components: { Authors, BookNew, ConfirmDelete },
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
    ...mapMutations(["requestConfirmation"]),
    searchFor(cat) {
      this.$emit("searchFor", cat);
    },
    remove() {
      this.deleteList(this.list);
    },
  },
};
</script>
<style scoped>
.actions-list {
  display: flex;
  flex-direction: row;
}
.list-title {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
}
.title {
  flex: 1;
  width: auto;
}
</style>