<template>
  <v-card-actions>
    <v-btn @click="$router.back()" color="grey darken-3">
      <v-icon>keyboard_return</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    <v-menu
      v-model="showMenu"
      :close-on-content-click="false"
      allow-overflow
      offset-x
      top
      transition="slide-y-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="grey darken-3" dark v-bind="attrs" v-on="on">
          <v-icon>view_headline</v-icon>
        </v-btn>
      </template>

      <v-card id="actions" dark>
        <v-list class="grey darken-3">
          <v-subheader>Opções de leitura</v-subheader>
          <v-list-item>
            <v-list-item-title class="mr-2"
              >Status da Leitura</v-list-item-title
            >
            <v-menu offset-y :close-on-content-click="false">
              <template v-slot:activator="{ attrs, on }">
                <v-btn v-on="on" v-bind="attrs" text>
                  <v-icon>notes</v-icon>
                </v-btn>
              </template>
              <v-list dense dark rounded class="mt-1 grey darken-3">
                <v-subheader>STATUS</v-subheader>
                <v-list-item-group v-model="book.read.status">
                  <v-list-item
                    @click="updateRead(book.read)"
                    v-for="s of readingStatus"
                    :key="s.value"
                    :value="s.value"
                  >
                    <v-icon :color="s.color">{{ s.icon }}</v-icon>
                    <v-list-item-content class="pa-2">
                      <v-list-item-title>{{ s.name }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
          </v-list-item>
          <v-subheader>Opções do livro</v-subheader>
          <v-list-item>
            <v-list-item-title class="mr-2"> Alterar titulo </v-list-item-title>
            <v-btn
              @click="changeTitle()"
              text
              :color="showInputTitle ? 'success' : ''"
            >
              <v-icon>{{ showInputTitle ? "done" : "edit" }}</v-icon>
            </v-btn>
          </v-list-item>
          <v-text-field
            v-show="showInputTitle"
            v-model="newTitle"
            @keydown.enter="changeTitle()"
            class="pr-4 pl-4"
            label="Insira o novo titulo"
            clearable
          ></v-text-field>
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
                v-model="file"
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
import { mapActions } from "vuex";
import { READING_STATUS } from "@/services/enums";
import ConfirmDelete from "./ConfirmDelete";

export default {
  name: "BookActions",
  props: { book: { type: Object, requerid: true } },
  components: { ConfirmDelete },
  data() {
    return {
      showMenu: false,
      showInputFile: false,
      showInputTitle: false,
      file: null,
      newTitle: "",
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
      return this.file.type === "application/pdf";
    },
    hasPDF() {
      return !!this.book.path;
    },
    readingStatus() {
      return READING_STATUS;
    },
  },
  methods: {
    ...mapActions(["deleteBook", "updateBook", "updateRead"]),
    async addFile() {
      if (!this.isValidFile) return;
      this.$emit("loading", true);
      const file = this.file;
      const book = this.book;
      const path = createPath(book);
      const { img, numPages } = await getBookCover(file);
      await uploadBook(path, file);
      await uploadImg(path, img);
      book.path = path;
      book.read.totalPages = numPages;
      await this.updateBook(book);
      this.$emit("loading", false);
      this.$emit("addedPDF");
    },
    async remove() {
      this.$emit("loading", true);
      await this.deleteBook(this.book);
      this.$router.back();
    },
    async changeTitle() {
      this.showInputTitle = !this.showInputTitle;
      if (this.newTitle) {
        this.book.title = this.newTitle;
        this.updateBook(this.book);
      }
    },
  },
  watch: {
    showMenu(val) {
      if (!val) {
        this.showInputTitle = false;
        this.showInputFile = false;
      }
    },
  },
};
</script>

<style scoped>
</style>