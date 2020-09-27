<template>
  <v-card dark>
    <v-card-title>Adicionar uma nova lista</v-card-title>
    <v-row>
      <v-col>
        <v-text-field
          v-model="list.name"
          class="ml-3"
          autofocus
          label="Nome da lista"
          hint="Informe o nome da nova lista"
        ></v-text-field>
        <v-combobox
          class="ml-2"
          v-model="list.categories"
          :items="items"
          chips
          clearable
          label="Categorias (opcional)"
          hint="Após digitar aperte enter para confirmar ou selecione alguma das opções predefinidas."
          multiple
          prepend-icon="filter_list"
        >
          <template v-slot:selection="{ attrs, item, select, selected }">
            <v-chip
              v-bind="attrs"
              :input-value="selected"
              close
              @click="select"
              @click:close="remove(item)"
            >
              <strong>{{ item }}</strong>&nbsp;
              <span>(categoria)</span>
            </v-chip>
          </template>
        </v-combobox>
      </v-col>
      <v-col>
        <div class="ml-2">
          <v-switch color="info" v-model="addDescription" label="Adicionar descrição"></v-switch>
        </div>

        <div class="mr-2">
          <v-textarea
            v-model="list.description"
            v-show="addDescription"
            autofocus
            auto-grow
            rows="1"
            row-height="2"
          ></v-textarea>
        </div>
      </v-col>
    </v-row>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="addList()" color="grey darken-3" :disabled="!list.name">
        <v-icon color="info">add</v-icon>Salvar
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn @click="clear()" color="grey darken-3">
        <v-icon color="info">close</v-icon>Limpar
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "NewList",
  data() {
    return {
      list: {},
      addDescription: false,
      description: "",
      items: [
        "Literatura Clássica",
        "Estudos",
        "Ficção Fantastica",
        "Literatura brasileira",
        "Romances",
        "Contos",
        "Ficção Cientifica",
      ],
    };
  },
  methods: {
    ...mapActions(["saveList"]),
    async addList() {
      await this.saveList(this.list);
      this.$store.commit("createList", false);
    },
    clear() {
      this.list = {};
      this.addDescription = false;
      this.description = "";
    },
    remove(item) {
      this.list.categories.splice(this.list.categories.indexOf(item), 1);
      this.list.categories = [...this.list.categories];
    },
  },
  computed: {
    info() {
      return this.$store.state.info;
    },
  },
};
</script>

<style>
.new-list-form {
  display: flex;
  flex-direction: row;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>