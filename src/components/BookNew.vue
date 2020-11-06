<template>
  <v-dialog id="book-new" v-model="dialog" hidden persistent max-width="600">
    <template v-slot:activator="{ on, attrs }">
      <v-btn text v-bind="attrs" v-on="on">
        <v-icon>book</v-icon>
      </v-btn>
    </template>
    <v-card dark class="grey darken-4" max-height="450">
      <v-progress-linear
        height="13"
        color="success"
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
          :error="isPresent"
          :error-messages="isPresent ? 'Esse livro já foi salvo' : ''"
        />
        <v-row>
          <!-- serie -->
          <v-col>
            <v-combobox
              v-model="book.serie.name"
              @input.native="e => book.serie.name = e.target.value"
              type="String"
              eager
              :cache-items="false"
              label="Serie (opcional)"
              :items="getSeries"
              item-text="name"
              :return-object="false"
              hint="Serie a qual o livro pertence. "
            >
            </v-combobox>
          </v-col>
          <!-- autor -->
          <v-col v-if="!author.id">
            <v-combobox
              v-model="author.name"
              @input.native="e => author.name = e.target.value"
              :items="authors"
              item-text="name"
              item-value="name"
              value="name"
              :return-object="false"
              readingList="author-field"
              label="Author (opcional)"
              hint="Nome do autor deste livro"
            >
            </v-combobox>
          </v-col>
        </v-row>

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
import { replace } from "@/services/utils";
import { getBookCover } from "@/services/PdfService";
import { uploadBook, uploadImg, createPath } from "@/services/storage";

export default {
  name: "BookNew",
  props: {
    readingList: Object,
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
        read: { lastReading: Date.now() },
        author: {},
        serie: {},
      },
      ruleTitle: [
        () =>
          !this.isPresent || "Um livro de mesmo nome já existe nesta coleção.",
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
    ...mapGetters(["getAuthorsByList", "getBooksByAuthor", "getSeries"]),
    isPresent() {
      const author = this.getAuthor;
      if (!author.id || this.loading) return false;
      const books = this.getBooksByAuthor(author);
      const exists = books.some(
        (b) => replace(b.title) === replace(this.book.title)
      );
      return exists;
    },
    isValid() {
      const file = this.file;
      if ((file && file.type !== "application/pdf") || this.isPresent)
        return false;
      return !!this.book.title;
    },
    authors() {
      const authors = this.getAuthorsByList(this.readingList);
      return authors;
    },
    getAuthor() {
      if (this.author.id) return this.author;
      const name =
        this.author?.name?.trim() || `Meus livros (${this.readingList.name})`;
      const author = this.authors.find(
        (a) => replace(a.name) === replace(name)
      );
      const newAuthor = { name, readingList: this.readingList };
      return author?.id ? author : newAuthor;
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
        read: { lastReading: Date.now() },
        author: {},
        serie: {},
      };
    },
    getAuxiliaryName() {
      if (this.book.name) return;
      const fileName = this.file.name.trim();
      const authorName = this.author?.name;
      const regExp = /.pdf|$|@|-|=|%|#|_|~|\+|\$|\*|\|/g;
      const auxName = fileName.replace(regExp, " ");
      const formatedFileName = auxName
        .replaceAll("  ", "")
        .replace(authorName, "");
      this.book.title = formatedFileName;
    },
    async saveImg() {
      const { img, numPages } = await getBookCover(this.file);
      await uploadImg(this.book.path, img);
      this.book.read.totalPages = numPages;
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
    async addAuthor() {
      const author = this.getAuthor;
      if (author?.id) return author;
      return await this.saveAuthor(author);
    },
    async addBook() {
      try {
        const book = this.book;
        book.author = await this.addAuthor();
        book.serie = book.serie.name ? book.serie : {};
        if (!this.file) {
          await this.saveBook(book);
          return this.close();
        }
        book.path = createPath(book);
        await this.saveImg();
        this.saveBook(book);
        this.savePdf();
      } catch (err) {
        this.error = true;
        this.close();
        console.error(err);
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

.close-button {
  position: absolute;
  margin: 5px;
  top: 0;
  right: 0;
}
</style>

