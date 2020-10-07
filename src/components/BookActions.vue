<template>
  <v-card-actions>
    <v-btn @click="$router.back()" color="grey darken-3">
      <v-icon>keyboard_return</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    <v-menu
      :close-on-content-click="false"
      allow-overflow
      offset-x
      top
      transition="slide-y-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="grey darken-3" dark v-bind="attrs" v-on="on">
          <v-icon>view_headline </v-icon>
        </v-btn>
      </template>

      <v-card id="actions" dark :loading="loading">
        <v-list class="grey darken-3">
          <v-subheader>Opções de leitura</v-subheader>
          <v-list-item>
            <v-list-item-title>Ler</v-list-item-title>
            <v-btn @click="openBook(true)" :disabled="!hasPDF" text>
              <v-icon title="">menu_book</v-icon>
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="mr-2">Marcar como lido</v-list-item-title>
            <v-btn @click="setAsRead()" text>
              <v-icon title="">library_add_check</v-icon>
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Adicionar descrição</v-list-item-title>
            <v-btn @click="addDescription()" text>
              <v-icon>notes</v-icon>
            </v-btn>
          </v-list-item>
          <v-subheader>Opções do livro</v-subheader>
          <template v-if="!hasPDF">
            <v-list-item>
              <v-list-item-title class="mr-2">
                Adicionar arquivo
              </v-list-item-title>
              <v-btn @click="showInputFile = !showInputFile" text>
                <v-icon>picture_as_pdf</v-icon>
              </v-btn>
            </v-list-item>
            <v-list-item v-if="showInputFile">
              <v-file-input
                class="mb-4"
                v-model="book.file"
                @change="addFile()"
                show-size
                label="Incluir arquivo"
                :rules="ruleFile"
                hint="Selecione o livro a ser salvo."
                persistent-hint
              >
              </v-file-input>
            </v-list-item>
          </template>
          <v-list-item>
            <v-list-item-title class="mr-2">Excluir</v-list-item-title>
            <v-btn @click="remove()" append text>
              <v-icon>delete</v-icon>
            </v-btn>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </v-card-actions>
</template>

<script>
import { uploadBook, uploadImg, createPath } from "@/services/storage";
import { getBookCover } from "@/services/PdfService";
import { READING_STATUS as status } from "@/services/enums";
import { mapMutations, mapActions } from "vuex";

export default {
  name: "BookActions",
  props: { book: { type: Object, requerid: true } },
  data() {
    return {
      loading: false,
      showListChange: false,
      showInputFile: false,
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
    isValidFile() {
      return this.book?.file.type === "application/pdf";
    },
    hasPDF() {
      return !!this.book.path;
    },
  },
  methods: {
    ...mapActions(["deleteBook", "updateBook"]),
    ...mapMutations(["openBook"]),
    setAsRead() {
      this.book.readingStatus = status.COMPLETED;
      this.updateBook(this.book);
    },
    async addFile() {
      this.loading = true;
      if (this.isValidFile) {
        this.book.path = createPath(this.book);
        const { img, numPages } = await getBookCover(this.book.file);
        await uploadBook(this.book);
        await uploadImg({ path: this.book.path, imgDataURL: img });
        this.book.totalPages = numPages;
        await this.updateBook(this.book);
        this.$emit("addedPDF")
      }
      this.loading = false;
    },
    async remove() {
      this.loading = true;
      await this.deleteBook(this.book);
      this.$router.back();
    },
  },
};
</script>

<style>
</style>