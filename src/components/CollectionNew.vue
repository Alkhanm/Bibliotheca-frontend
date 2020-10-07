<template>
  <v-dialog v-model="dialog" max-width="700px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" small fab>
        <v-icon color="green">mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card dark>
      <h3 class="mt-2 text-center">Adicionar coleção</h3>
      <v-card-title>
        <h4 class="subtitle-2">
          Organize-se melhor. Faça seleções de livros organizando-os por autor,
          serie, saga, etc...
        </h4>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="collection.name"
          clearable
          maxlength="30"
          label="Nome da coleção"
          height="50"
          persistent-hint
        >
        </v-text-field>
        <v-row>
          <v-col cols="12" sm="6">
            <v-btn @click="newCollection()" block class="grey darken-3">
              Salvar
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              @click="(dialog = false), (collection = {})"
              block
              class="grey darken-3"
            >
              Fechar
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    list: {
      requerid: true,
      type: Object,
    },
  },
  data: () => ({ 
    collection: {}, 
    dialog: false 
  }),
  methods: {
    newCollection() {
      this.collection.list = this.list;
      this.$store.dispatch("saveCollection", this.collection);
      this.dialog = false;
      this.collection = {};
    },
  },
};
</script>

<style>
</style>