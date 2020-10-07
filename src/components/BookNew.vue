<template>
  <v-dialog v-model="dialog" persistent max-width="800px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"
        fab
        small
        color="grey darken-3 text-lowercase"
      >
        <v-icon color="success">mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card dark class="grey darken-4">
      <v-card-title>
        <p class="headline text-center">Novo Livro</p>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="book.title"
          autofocus
          label="Título"
          hint="Informe o título deste livro. Se vazio, o nome do arquivo será usado."
        />
        <!-- Upload do livro -->
        <v-file-input
          class="mb-4"
          v-model="book.file"
          show-size
          label="Incluir arquivo"
          :rules="ruleFile"
          hint="Selecione o livro a ser salvo."
          persistent-hint
        >
        </v-file-input>
        <v-row>
          <v-col cols="12" sm="6">
            <v-btn
              @click="add()"
              :loading="loading"
              :disabled="!isValid"
              block
              class="grey darken-3"
            >
              Salvar
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              @click="(dialog = false), (book = {}), (loading = false)"
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
import { mapActions } from "vuex";
import { uploadBook, uploadImg, createPath } from "@/services/storage";
import { getBookCover } from "@/services/PdfService";

export default {
  name: "BookNew",
  props: { collection: Object },
  data: () => ({
    dialog: false,
    loading: false,
    book: {},
    ruleFile: [
      (v) =>
        (!!v && v.type === "application/pdf") || "Tipo de arquivo não aceito.",
      (v) =>
        (!!v && v.size < 15728640) ||
        "Ainda não é possivel salvar arquivos tão grandes.",
    ],
  }),
  computed: {
    isValid() {
      const file = this.book?.file;
      if (file && file.type !== "application/pdf") return false;
      return this.book.title;
    },
  },
  methods: {
    ...mapActions(["saveBook"]),
    async add() {
      this.loading = true;
      this.book.collection = this.collection;
      if (this.book.file) {
        this.book.path = createPath(this.book);
        const { img, numPages } = await getBookCover(this.book.file);
        await uploadBook(this.book);
        await uploadImg({ path: this.book.path, imgDataURL: img });
        this.book.totalPages = numPages;
      }
      await this.saveBook(this.book); //espera a operação
      this.dialog = false;
      this.loading = false;
    },
  },
};
</script>

<style>
.form-book {
  width: 80%;
}
.select-field {
  display: flex;
}
</style>

