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

      <v-card id="actions" dark>
        <v-list class="grey darken-3">
          <v-subheader>Opções de leitura</v-subheader>
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
                v-model="book.file"
                @change="addFile()"
                class="mb-4"
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
            <ConfirmDelete :callback="remove"></ConfirmDelete>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </v-card-actions>
</template>

<script>
import { uploadBook, uploadImg, createPath } from "@/services/storage";
import { getBookCover } from "@/services/PdfService";
import { mapMutations, mapActions } from "vuex";
import ConfirmDelete from "./ConfirmDelete";

export default {
  name: "BookActions",
  props: { book: { type: Object, requerid: true } },
  components: { ConfirmDelete },
  data() {
    return {
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
    ...mapActions(["deleteBook", "updateBook", "updateReading"]),
    ...mapMutations(["openBook", "requestConfirmation"]),
    async addFile() {
      this.$emit("loading", true);
      const book = this.book;
      const reading = book.reading;
      if (this.isValidFile) {
        book.path = createPath(book);
        console.log(book);
        const { img, numPages } = await getBookCover(this.book.file);
        await uploadBook(this.book);
        await uploadImg({ path: book.path, imgDataURL: img });
        await this.updateBook(book);
        await this.updateReading(reading);
        reading.totalPages = numPages;
      }
      this.$emit("addedPDF");
      this.$emit("loading", false);
    },
    async remove() {
      this.$emit("loading", true);
      await this.deleteBook(this.book);
      this.$router.go({ name: "Listas" });
    },
  },
};
</script>

<style scoped>
</style>