<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" fab small>
        <v-icon>book</v-icon>
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
          hint="Edite o título deste livro aqui."
          persistent-hint
          clearable
          class="mb-5"
        />
        <v-text-field
          v-model="author.name"
          list="author-field"
          label="Author e/ou serie (opcional)"
          hint="Nome do autor (ou serie) a qual o livro pertence. "
        >
        </v-text-field>
        <datalist id="author-field">
          <option
            v-for="author in authors"
            :key="author.id"
            class="author-option pa-5"
            :value="author.name"
          />
        </datalist>

        <!-- Upload do livro -->
        <v-file-input
          @change="getAuxiliaryName()"
          class="mb-4"
          v-model="file"
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
import { mapActions, mapGetters } from "vuex";
import { uploadBook, uploadImg, createPath } from "@/services/storage";
import { getBookCover } from "@/services/PdfService";

export default {
  name: "BookNew",
  props: { list: Object },
  data() {
    return {
      items: ["foo", "bar", "fizz", "buzz"],
      dialog: false,
      loading: false,
      book: {},
      author: { list: this.list },
      file: null,
      ruleFile: [
        (v) =>
          (!!v && v.type === "application/pdf") ||
          "Tipo de arquivo não aceito.",
        (v) =>
          (!!v && v.size < 15728640) ||
          "Ainda não é possivel salvar arquivos tão grandes.",
      ],
    };
  },
  computed: {
    ...mapGetters(["getAuthorByName"]),
    isValid() {
      if (this.file && this.file.type !== "application/pdf") return false;
      return this.book.title;
    },
    authors() {
      const authors = this.$store.state.author.arr;
      if (!authors.length) this.fetchAuthors(this.list)
      return authors;
    },
  },
  methods: {
    ...mapActions(["saveBook", "saveAuthor", "fetchAuthors"]),
    getAuxiliaryName(){
      if (this.book.name) return
      const fileName = this.file.name
      // ^&‘{}[],!–?()
      const regExp = /pdf|@|-|=|%|#|_|~|\+|\$|\*|\|/g;
      const auxName = fileName.replace(regExp,  " ")
      const name = auxName.replaceAll("  ", "").trim()
      this.book.title = name
    },
    async addAuthor() {
      if (!this.author.name) this.author.name = "Minha coleção"
      const author =
        this.getAuthorByName(this.author.name) ||
        (await this.saveAuthor(this.author));
      return author;
    },
    async addBook() {
      this.book.file = this.file;
      this.book.author = await this.addAuthor();
      if (this.book.file) {
        this.book.path = createPath(this.book);
        const { img, numPages } = await getBookCover(this.book.file);
        await uploadBook(this.book);
        await uploadImg({ path: this.book.path, imgDataURL: img });
        this.book.totalPages = numPages;
      }
      await this.saveBook(this.book); //espera a operação
    },
    async add() {
      this.loading = true;
      await this.addBook();
      console.log(this.author.name);
      this.dialog = false;
      this.loading = false;
    },
  },
};
</script>

<style>
.form-book {
  width: 70%;
}
.select-field {
  display: flex;
}
</style>

