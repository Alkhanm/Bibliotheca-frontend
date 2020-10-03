<template>
  <v-dialog v-model="dialog" persistent max-width="800px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"
        fab
        small
        color="grey darken-3 text-lowercase">
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
            hint="Informe o título deste livro. Se vazio, o nome do arquivo será usado."/>
          <!-- Upload do livro -->
          <v-file-input
            class="mb-4"
            v-model="book.file"
            show-size
            label="Incluir arquivo"
            :rules="ruleFile"
            hint="Selecione o livro a ser salvo."
            persistent-hint>
          </v-file-input>
          <v-row>
            <v-col cols="12" sm="6">
              <v-btn
                @click="add()"
                :loading="loading"
                :disabled="!isValid"
                block
                class="grey darken-3">
                Salvar
                </v-btn>
            </v-col>
            <v-col>
              <v-btn
                @click="(dialog = false), (book = {}), (loading = false)"
                block
                class="grey darken-3">
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
import { uploadBook, uploadImg } from "@/services/storage"
import {renderPDF, renderPage} from "@/services/PdfService"
import formatText from "@/services/replace";

export default {
  name: "BookNew",
  props: { author: Object },
  data: () => ({ 
      dialog: false,
      loading: false,
      valid: false,
      book: {},
      ruleFile: [
        (v) =>
          (!!v && v.type === "application/pdf") ||
          "Tipo de arquivo não aceito.",
        (v) =>
          (!!v && v.size < 15728640) ||
          "Ainda não é possivel salvar arquivos tão grandes.",
      ],
  }),
  computed: {
    userId() {
      return this.$store.state.user.id;
    },
    getBook() {
      const author = this.author;
      const list = author.list;
      const book = { ...this.book, author };
      if (book.file) {
        const concat = `${this.userId}/${list.name}/${author.name}/${book.title}`
        const path = formatText(concat).replaceAll(" ", "-").toLowerCase();
        book.path = path;
      }
      return book;
    },
    isValid() {
      const file = this.book.file;
      if (file && file.type !== "application/pdf") return false;
      return this.book.title;
    },
  },
  methods: {
    ...mapActions(["saveBook"]),
    async add() {
      this.loading = true;
      const book = this.getBook;
      if (book.file) {
        const imgDataURL = await this.getBookCover(book.file);
        await uploadBook(book);
        await uploadImg({path: `${book.path}-img`, imgDataURL})
      }
      await this.saveBook(book); //espera a operação
      this.dialog = false;
      this.loading = false;
    },
    async getBookCover(file){
      const pdf = await renderPDF(file)
      const page = await renderPage(pdf, 1)
      return page.toDataURL("img/jpeg", 0.5)
    }
    
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

