<template>
  <v-dialog id="book-new" v-model="dialog" persistent max-width="600">
    <template v-slot:activator="{ on, attrs }">
      <v-btn text v-bind="attrs" v-on="on">
        <v-icon>book</v-icon>
      </v-btn>
    </template>
    <v-card dark class="grey darken-4" max-height="450">
      <v-progress-linear
        height="13"
        color="info"
        background-opacity="0.7"
        :buffer-value="progressUpload"
      ></v-progress-linear>
      <v-card-title>
        <h2 class="headline text-center">Novo Livro</h2>
      </v-card-title>
      <v-btn
        @click="dialog = false"
        :disabled="!loading"
        class="close-button"
        icon
        text
      >
        <v-icon>expand_more</v-icon>
      </v-btn>
      <v-card-text>
        <v-text-field
          v-model="book.title"
          :rules="ruleTitle"
          autofocus
          label="Título"
          hint="Adicione o título do novo livro aqui."
          persistent-hint
          clearable
          class="mb-5"
          :error="hasBook"
          :error-messages="hasBook ? 'Esse livro já foi salvo' : ''"
        />
        <template v-if="!author.id">
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
        </template>

        <!-- Upload do livro -->
        <v-file-input
          @change="getAuxiliaryName()"
          class="mb-4"
          v-model="file"
          type="file"
          accept="application/pdf"
          show-size
          label="Incluir arquivo"
          :rules="ruleFile"
          hint="Selecione o livro a ser salvo."
          persistent-hint
        >
        </v-file-input>
        <v-row class="pb-0 mb-0">
          <v-col class="pa-2" cols="12" sm="6">
            <v-btn
              @click="add()"
              :loading="loading"
              :disabled="!isValid"
              block
              class="grey darken-3"
              append
            >
              Salvar
            </v-btn>
          </v-col>
          <v-col class="pa-2" cols="12" sm="6">
            <v-btn @click="close()" block class="grey darken-3"> Fechar </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import {
  getBookCover,
  getAuxiliaryName as getNameFrom,
} from "@/services/PdfService";
import { uploadBook, uploadImg, createPath } from "@/services/storage";

export default {
  name: "BookNew",
  props: {
    list: Object,
    author: {
      type: Object,
      default: () => ({
        id: 0,
        name: "",
      }),
    },
  },
  data() {
    return {
      dialog: false,
      loading: false,
      error: false,
      message: "",
      progressUpload: 0,
      file: null,
      book: {
        title: "",
        reading: { lastReading: Date.now() },
        author: {},
      },
      ruleTitle: [
        () =>
          (!this.loading && !this.hasBook) ||
          "Um livro de mesmo nome já existe nesta coleção.",
      ],
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
    ...mapGetters(["getAuthorByName", "getAuthorsByList", "getBooksByAuthor"]),
    hasBook() {
      const author = this.getAuthorByName(this.author.name) || {};
      const books = this.getBooksByAuthor(author);
      const exists = books.some(
        (b) =>
          b.title.trim().toUpperCase() === this.book.title.trim().toUpperCase()
      );
      return exists;
    },
    isValid() {
      const file = this.file;
      if ((file && file.type !== "application/pdf") || this.hasBook)
        return false;
      return !!this.book.title;
    },
    authors() {
      const authors = this.getAuthorsByList(this.list);
      return authors;
    },
  },
  methods: {
    ...mapActions(["saveBook", "saveAuthor"]),
    close() {
      this.progressUpload = 0;
      this.dialog = false;
      this.loading = false;
      this.error = false;
      this.file = null;
      this.book = {
        title: "",
        reading: { lastReading: Date.now() },
        author: {},
      };
    },
    getAuxiliaryName() {
      if (this.book.name) return;
      const fileName = getNameFrom(this.file.name);
      this.book.title = fileName;
    },
    async addAuthor() {
      const name = this.author.name.trim() || `Meus livros (${this.list.name})`;
      const author = this.author.id ? this.author : this.getAuthorByName(name);
      if (author?.id) return author;
      const newAuthor = { name, list: this.list };
      return await this.saveAuthor(newAuthor);
    },
    async saveImg() {
      const { img, numPages } = await getBookCover(this.file);
      await uploadImg(this.book.path, img);
      this.book.reading.totalPages = numPages;
    },
    async savePdf() {
      const file = this.file;
      const path = this.book.path;
      uploadBook(path, file).on("state_changed", (state) => {
        const progress = (state.bytesTransferred / state.totalBytes) * 100;
        this.progressUpload = progress;
        if (progress >= 100) this.close();
      });
    },
    async addBook() {
      const book = this.book;
      try {
        book.author = await this.addAuthor();
        if (!this.file) return this.saveBook(this.book);
        book.path = createPath(book);
        await this.saveImg();
        this.saveBook(book);
        this.savePdf();
      } catch (err) {
        this.error = true;
        console.error(err);
      } finally {
        this.close();
      }
    },
    async add() {
      this.loading = true;
      await this.addBook();
    },
  },
};
</script>

<style scoped>
#book-new {
  height: 50px;
}
.form-book {
  width: 70%;
}
.select-field {
  display: flex;
}
.close-button {
  position: absolute;
  margin: 5px;
  top: 0;
  right: 0;
}
</style>

