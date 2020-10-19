<template>
    <v-card
      id="library"
      dark
      class="mx-auto pa-2 library"
      max-width="1000"
      :loading="loading"
    >
      <v-card-title>
        <span>
          <span class="text-capitalize"
            >{{ book.title }}
          </span>
          [{{ status.name }} ]
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
      <v-card-subtitle class="text-capitalize pt-2">
        <v-chip :to="{ name: 'Autor', params: { id: book.author.id } }" outlined>{{ book.author.name }}</v-chip>
      </v-card-subtitle>

      <v-divider></v-divider>

      <v-card-text id="content" class="text-capitalize">
        <div v-if="loading">
          <v-btn large fab loading></v-btn>
          <p class="mr-2">Aguarde...</p>
        </div>
        <template v-else-if="pdfURL">
          <PDFReader :book="book" :pdfURL="pdfURL" :imgURL="imgURL"></PDFReader>
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
import { READING_STATUS as status } from "@/services/enums";
import { downloadPDF, downloadIMG } from "@/services/storage";
import BookActions from "./BookActions";
import PDFReader from "./PDFReader";

export default {
  name: "Book",
  props: { id: { type: Number, required: false }},
  components: { BookActions, PDFReader },
  data: () => ({ pdfURL: "", imgURL: "", loading: null }),
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
      const last = new Date(this.book.lastReading);
      return last.toLocaleString().split(" ").reverse().join(" ");
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
        (this.status.value / 100) * colorsOptions.length,
        colorsOptions.length - 1
      );
      const color = colorsOptions[colorNumber];
      return color;
    },
    status() {
      const name = this.book.readingStatus;
      const value =
        name === status.COMPLETED
          ? 100
          : (this.book.currentPage / this.book.totalPages) * 100;
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
        this.imgURL = await downloadIMG(this.book);
        this.pdfURL = await downloadPDF(this.book);
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