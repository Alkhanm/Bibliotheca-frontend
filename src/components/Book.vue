<template>
  <v-container>
    <v-card id="library" dark class="mx-auto pa-2" max-width="1000">
      <v-card-title>
        <span>
          <span class="text-capitalize">{{ book.title }}</span> [
          {{ status.name }} ]
          <v-progress-linear
            v-if="hasPDF"
            :value="status.value"
            striped
            height="10px"
            :color="statusColor"
          >
          </v-progress-linear>
        </span>
      </v-card-title>
      <v-card-subtitle class="text-capitalize">
        Coleção: {{ book.collection.name }}
      </v-card-subtitle>

      <v-divider></v-divider>

      <v-card-text id="content" class="text-capitalize">
        <div v-if="loading">
          <v-btn large fab loading></v-btn>
          <p class="mr-2">Aguarde...</p>
        </div>
        <template v-else-if="hasPDF">
          <v-img
            @click="openBook(true)"
            :src="imgURL"
            class="image-book"
            max-width="30%"
          />
          <PDFReader :book="book" :pdfURL="pdfURL"></PDFReader>
        </template>
        <p id="text-about-book" class="text-start pl-5 pr-5">
          {{ book.about }}
        </p>
        <span class="text-end">
          <div>Lista: {{ book.collection.list.name }}</div>
          <div>Categorias: {{ categories }}</div>
          <div>Última leitura: {{ lastReading }}</div>
        </span>
      </v-card-text>

      <v-divider></v-divider>

      <BookActions @addedPDF="getArchives()" :book="book"></BookActions>
    </v-card>
  </v-container>
</template>

<script>
import BookActions from "./BookActions";
import { READING_STATUS as status } from "@/services/enums";
import PDFReader from "./PDFReader";
import { mapGetters, mapMutations } from "vuex";
import { downloadBook } from "@/services/storage";

export default {
  name: "Book",
  components: { BookActions, PDFReader },
  data: () => ({ pdfURL: "", imgURL: "", loading: null }),
  computed: {
    ...mapGetters(["getBookById"]),
    book() {
      const id = this.$route.params.id;
      return this.getBookById(id);
    },
    categories() {
      const cat = this.book?.collection?.list?.categories;
      return cat.length
        ? cat.reduce((acc, att) => acc.concat(", ", att))
        : "Sem catégorias";
    },
    lastReading() {
      const date = new Date(this.book.lastReading);
      return date.toLocaleString().split(" ").reverse().join(" ");
    },
    statusColor() {
      const colorsOptions = [
        "#BDBDBD",
        "#80D8FF",
        "#00B0FF",
        "info",
        "success",
      ];
      const colorNumber = Math.min(
        Math.round((this.status.value / 100) * colorsOptions.length),
        colorsOptions.length - 1
      );
      const color = colorsOptions[colorNumber];
      return color;
    },
    status() {
      const name = this.book.readingStatus;
      const value = name === status.COMPLETED ? 100 : (this.book.currentPage / this.book.totalPages) * 100;
      return { name, value };
    },
    hasPDF() {
      return !!this.book.path;
    },
  },
  methods: {
    ...mapMutations(["openBook"]),
    async getArchives() {
      this.loading = true;
      try {
        const { img, pdf } = await downloadBook(this.book);
        this.imgURL = img;
        this.pdfURL = pdf;
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
  async created() {
    if (!this.book) this.$router.push({ name: "Listas" });
    if (this.hasPDF) await this.getArchives();
  },
};
</script>
<style>
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
.image-book {
  cursor: pointer;
}
.progress-reading {
  color: #ffab40;
}
</style>