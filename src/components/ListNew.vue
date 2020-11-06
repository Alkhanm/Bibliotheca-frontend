<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-on="on" v-bind="attrs" text>
        <v-icon>library_add</v-icon>
      </v-btn>
    </template>
    <v-card dark max-height="450">
      <v-card-title>Adicionar uma nova lista</v-card-title>
      <v-card-text>
        <v-text-field
          class="form-input"
          v-model="readingList.name"
          autofocus
          label="Nome da lista"
          hint="Informe o nome da nova lista"
        ></v-text-field>
        <v-combobox
          class="form-input"
          v-model="readingList.categories"
          :items="items"
          chips
          label="Categorias (opcional)"
          hint="Após digitar aperte enter para confirmar ou selecione alguma das opções predefinidas."
          multiple
        >
          <template v-slot:selection="{ attrs, item, select, selected }">
            <v-chip
              v-bind="attrs"
              :input-value="selected"
              close
              @click="select"
              @click:close="remove(item)"
            >
              <strong>{{ item }}</strong
              >&nbsp;
              <span>(categoria)</span>
            </v-chip>
          </template>
        </v-combobox>
        <v-switch
          color="info"
          v-model="addDescription"
          label="Adicionar descrição"
        ></v-switch>
        <v-textarea
          v-model="readingList.description"
          v-show="addDescription"
          class="ma-0 pt-0 mb-2"
          autofocus
          auto-grow
          rows="1"
          hint="Escreva um pequena descrição sobre desta lista."
          row-height="3"
        ></v-textarea>
        <v-row class="pb-0 mb-0">
          <v-col class="pa-2" cols="12" sm="6">
            <v-btn
              @click="addList()"
              block
              color="grey darken-3"
              :disabled="!readingList.name"
            >
              Salvar
            </v-btn>
          </v-col>
          <v-col class="pa-2" cols="12" sm="6">
            <v-btn @click="close()" block color="grey darken-3"> Fechar </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "ListNew",
  data() {
    return {
      dialog: false,
      readingList: {},
      addDescription: false,
      items: [
        "Literatura Clássica",
        "Literatura brasileira",
        "Estudo",
        "Suspense e Terror",
        "Ficção Fantastica",
        "Ficção Cientifica",
        "Romance",
        "Contos",
      ],
    };
  },
  methods: {
    ...mapActions(["saveList"]),
    async addList() {
      this.saveList(this.readingList);
      this.close();
    },
    close() {
      this.dialog = false;
      this.readingList = {};
    },
    remove(item) {
      this.readingList.categories.splice(
        this.readingList.categories.indexOf(item),
        1
      );
      this.readingList.categories = [...this.readingList.categories];
    },
  },
  computed: {
    info() {
      return this.$store.state.info;
    },
  },
};
</script>

<style scoped>
.new-readingList-form {
  display: flex;
  flex-direction: row;
}
</style>