<template>
  <v-card
    id="library"
    dark
    class="mx-auto pa-2"
    max-width="1000"
    :loading="loading"
  >
    <v-card-text class="ma-0 pa-0">
      <h3 class="ml-1 mb-1 subtitle">{{ serie }}</h3>
      <h2 class="ml-1 title2 text-capitalize">
        {{ book.title }}
        [<span :style="`color: ${status.color}`">{{ status.name }}</span
        >]
      </h2>
      <v-chip
        dark
        class="mt-2 mb-2"
        :to="{ name: 'Autor', params: { id: book.author.id } }"
        outlined
        >{{ book.author.name }}</v-chip
      >

      <v-divider></v-divider>

      <v-progress-linear
        class="mt-3 mb-2"
        v-if="hasPDF"
        :value="progressValue"
        striped
        height="13px"
        rounded
        :color="progressValue === 100 ? '#4CAF50' : '#1E88E5'"
      >
      </v-progress-linear>

      <v-card-text id="content" class="pa-1">
        <div v-if="loading">
          <v-btn large fab loading></v-btn>
          <p class="mr-2">Buscando arquivo...</p>
        </div>
        <div v-else-if="!pdfURL">
          Adicione um pdf a este <br />
          livro para começar a leitura.
        </div>
        <PDFReader
          v-else
          :read="book.read"
          v-bind="{ pdfURL, imgURL }"
        ></PDFReader>
        <div class="text-content">
          <div>Inicio da leitura: {{ startReading }}</div>
          <div>Última leitura: {{ lastRead }}</div>
        </div>
      </v-card-text>
    </v-card-text>

    <v-divider></v-divider>

    <BookActions
      @addedPDF="getArchives()"
      @loading="loading = $event"
      :book="book"
    ></BookActions>
  </v-card>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { downloadPDF, downloadIMG } from "@/services/storage";
import BookActions from "./BookActions";
import { formatDate } from "@/services/utils";
import PDFReader from "./PDFReader";
import { READING_STATUS } from "@/services/enums";

export default {
  name: "Book",
  props: { id: { type: Number || String, required: false } },
  components: { BookActions, PDFReader },
  data() {
    return {
      pdfURL: "",
      imgURL: "",
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["getBookById"]),
    startReading() {
      return formatDate(this.book.read.startReading);
    },
    lastRead() {
      return formatDate(this.book.read.lastRead);
    },
    book() {
      return this.getBookById(this.id);
    },
    serie() {
      const serie = this.book.serie ? this.book.serie.name : "";
      return serie;
    },
    progressValue() {
      const { page, totalPages } = this.book.read;
      const readingPercentage = (page / totalPages) * 100;
      return readingPercentage;
    },
    status() {
      const status = this.book.read.status;
      return READING_STATUS[status];
    },
    hasPDF() {
      return !!this.book.path;
    },
  },
  methods: {
    ...mapMutations(["openBook"]),

    async getArchives() {
      try {
        this.loading = true;
        this.imgURL = await downloadIMG(this.book.path);
        this.pdfURL = await downloadPDF(this.book.path);
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
  async mounted() {
    if (!this.book.id) this.$router.push({ path: "/menu" });
    if (this.hasPDF) await this.getArchives();
  },
};
</script>

<style scoped>
#content {
  display: flex;
  justify-content: space-between;
}

.text-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin: 5px;
}
</style>