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
        <v-form>
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
          ></v-file-input>
          <v-row>
            <v-col cols="12" sm="6">
              <v-btn
                @click="add()"
                :loading="loading"
                :disabled="!isValid"
                block
                class="grey darken-3"
                >Salvar</v-btn
              >
            </v-col>
            <v-col>
              <v-btn
                @click="(dialog = false), (book = {}), (loading = false)"
                block
                class="grey darken-3"
                >Fechar</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
        <v-img :src="imgURL"></v-img>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "Upload",
  props: { author: Object },
  data() {
    return {
      dialog: false,
      loading: false,
      valid: false,
      imgURL: "",
      book: {},
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
    userId() {
      return this.$store.state.user.id;
    },
    getBook() {
      const author = this.author;
      const list = author.list;
      const book = { ...this.book, author };
      if (book.file) {
        const path = `${this.userId}/${list.name}/${author.name}/${book.title}`
          .replaceAll(" ", "-")
          .toLowerCase();
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
    ...mapActions(["uploadBook", "saveBook"]),
    async add() {
      this.loading = true; //carregando...
      const book = this.getBook;
      if (book.file) {
        book.imgURL = await this.getImgURL(book.file);
        await this.uploadBook(book);
      }
      await this.saveBook(book); //espera a operação
      this.dialog = false;
    },

    async getImgURL(file) {
      // eslint-disable-next-line no-undef
      const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
      const page = await pdf.getPage(1);

      const scales = { 1: 3.2, 2: 4 };
      const defaultScale = 2;
      const scale = scales[window.devicePixelRatio] || defaultScale;

      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const displayWidth = 1;
      canvas.style.width = `${(viewport.width * displayWidth) / scale}px`;
      canvas.style.height = `${(viewport.height * displayWidth) / scale}px`;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      const renderTask = page.render(renderContext);

      await renderTask.promise;

      return canvas.toDataURL("image/jpeg", 1.0);
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

