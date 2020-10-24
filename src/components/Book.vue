<template>
  <v-card
    id="library"
    dark
    class="mx-auto pa-2 library"
    max-width="1000"
    :loading="loading"
  >
    <v-progress-linear
      v-if="hasPDF"
      :value="statusValue"
      striped
      height="10px"
      :color="statusColor"
    >
    </v-progress-linear>
    <v-card-text class="ma-0 pa-0">
      <h3 class="title text-capitalize white--text">
        {{ book.title }}
        <span :style="`color: ${statusColor}`">[{{ statusName }}]</span>
      </h3>
      <v-chip
        class="mb-2"
        :to="{ name: 'Autor', params: { id: book.author.id } }"
        outlined
        >{{ book.author.name }}</v-chip
      >
    </v-card-text>

    <v-divider></v-divider>

    <v-card-text id="content" class="text-capitalize">
      <div v-if="loading">
        <v-btn large fab loading></v-btn>
        <p class="mr-2">Buscando arquivo...</p>
      </div>
      <template v-else-if="pdfURL">
        <PDFReader
          :reading="book.reading"
          :pdfURL="pdfURL"
          :imgURL="imgURL"
        ></PDFReader>
      </template>
      <p id="text-about-book" class="text-start pl-5 pr-5">
        {{ book.about }}
      </p>
      <span class="text-end">
        <div>Lista: {{ book.author.list.name }}</div>
        <div>Categorias: {{ categories }}</div>
        <div>Última leitura: {{ lastReading }}</div>
      </span>
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
import PDFReader from "./PDFReader";

export default {
  name: "Book",
  props: { id: { type: Number, required: false } },
  components: { BookActions, PDFReader },
  data: () => ({ pdfURL: "", imgURL: "", loading: false }),
  computed: {
    ...mapGetters(["getBookById"]),
    book() {
      // Busca no store o livro q possua esse id
      const book = this.getBookById(this.id);
      // Ou busque o último livro
      if (!book) return this.$store.state.book.currentBook;
      return book;
    },
    categories() {
      const cat = this.book?.author?.list?.categories;
      return cat.length
        ? cat.reduce((acc, att) => acc.concat(", ", att))
        : "Sem catégorias";
    },
    lastReading() {
      const last = new Date(this.book.reading.lastReading);
      return last.toLocaleString().split(" ").reverse().join(" ");
    },
    statusColor() {
      return this.statusValue === 100 ? "#4CAF50" : "#1E88E5";
    },
    statusValue() {
      const { page, totalPages } = this.book.reading;
      const readingPercentage = (page / totalPages) * 100;
      return readingPercentage;
    },
    statusName() {
      const status = this.book.reading.status;
      return status;
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
}
#text-about-book {
  flex: 1;
}
</style>