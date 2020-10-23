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
          v-model="list.name"
          autofocus
          label="Nome da lista"
          hint="Informe o nome da nova lista"
        ></v-text-field>
        <v-combobox
          class="form-input"
          v-model="list.categories"
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
        <v-row class="pb-0 mb-0">
          <v-col class="pa-2" cols="12" sm="6">
            <v-btn
              @click="addList()"
              block
              color="grey darken-3"
              :disabled="!list.name"
            >
             Salvar
            </v-btn>
          </v-col>
          <v-col class="pa-2" cols="12" sm="6">
            <v-btn @click="close()" block color="grey darken-3">
              Fechar
            </v-btn>
          </v-col>
        </v-row>
        <!--  <v-col class="form-input">
            <div class="ml-2">
              <v-switch
                color="info"
                v-model="addDescription"
                label="Adicionar descrição"
              ></v-switch>
            </div>

            <div class="mr-2">
              <v-textarea
                v-model="list.description"
                v-show="addDescription"
                autofocus
                auto-grow
                rows="1"
                label=""
                row-height="2"
              ></v-textarea>
            </div>
          </v-col> -->
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
      list: {},
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
      await this.saveList(this.list);
      this.close()
    },
    close() {
      this.dialog = false;
      this.list = {};
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

<style scoped>
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