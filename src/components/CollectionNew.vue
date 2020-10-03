<template>
 <span>
    <v-btn @click="addCollection = true" small fab>
        <v-icon color="green">mdi-plus</v-icon>
    </v-btn>
   <v-dialog v-model="addCollection" fullscreen max-width="700px">
        <v-card dark>
            <h3 class="mt-2 text-center">Adicionar coleção</h3>
            <v-card-title>
            <h3 class="subtitle-1">
                Organize sua lista de leitura por autor ou serie
            </h3>
            </v-card-title>
            <v-card-text>
          <v-text-field
            v-model="author.name"
            clearable
            autofocus
            maxlength="30"
            label="Autor"
            height="50"
            hint="Digite o nome do autor"
          >
          </v-text-field>
          <v-text-field
            v-model="serie.name"
            clearable
            maxlength="30"
            label="Serie"
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
                @click="(addCollection = false), (author = {})"
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
 </span>
</template>

<script>
export default {
  props: { list: { requerid: true, type: Object } },
  data: () => ({ author: {}, serie: {}, addCollection: false }),
  methods: {
    newCollection() {
      this.author.list = this.list;
      this.$store.dispatch("saveAuthor", this.author);
      this.addCollection = false;
      this.author = {};
    },
  },
};
</script>

<style>
</style>