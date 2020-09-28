<template>
  <v-container>
    <v-card class="mx-auto" dark max-width="1000">
      <v-card-title class="headline text-md-subtitle-1">{{
        book.title
      }}</v-card-title>
      <v-card-subtitle class="text-capitalize"
        >Autor: {{ book.author.name }}</v-card-subtitle
      >
      <v-card-text id="content" class="text-capitalize">
        <v-btn v-if="loading" large fab loading></v-btn>
        <v-img
          v-else
          max-width="20%"
          :src="book.imgURL"
          alt="Imagem do livro"
        />
        <div class="text-right ml-5">
          {{ book.author.list.name }}
          <p>{{ categories }}</p>
          <p>{{ book.about }}</p>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="openBook = true" :disabled="loading">ler</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="deleteBook(book)">delete</v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="openBook" eager fullscreen scrollable>
      <v-card dark class="overflow-hidden mx-auto">
        <v-card-text
          @scroll="showBottomOnScroll($event)"
          @dblclick="showBottom = !showBottom"
          id="canvas-container"
          class="text-center pa-0"
        >
          <canvas id="the-canvas"></canvas>
        </v-card-text>
        <v-bottom-navigation
          :input-value="showBottom"
          hide-on-scroll
          app
          grow
          fixed
        >
          <v-btn fab x-small @click="increase()">
            <v-icon>add</v-icon>
          </v-btn>
          <v-btn fab x-small @click="decrease()">
            <v-icon>remove</v-icon>
          </v-btn>
          <v-btn @click="prev()">
            <span>Anterior</span>
            <v-icon>navigate_before</v-icon>
          </v-btn>
          <div class="page-count mt-7">
            <v-slider
              color="blue"
              v-model="slider"
              min="1"
              @mouseup="pageNum = slider"
              thumb-size="24"
              thumb-label="always"
              :max="pdf.numPages"
            ></v-slider>
            <span>{{ `${pageNum}/${pdf.numPages}` }}</span>
          </div>
          <v-btn @click="next()">
            <span>Próximo</span>
            <v-icon>navigate_next</v-icon>
          </v-btn>
          <v-btn x-small @click="close()">
            <span>Sair</span>
            <v-icon>keyboard_return</v-icon>
          </v-btn>
        </v-bottom-navigation>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Library",
  data: () => ({
    pdf: {},
    openBook: false,
    slider: 1,
    scale: 2.5,
    pageNum: 1,
    url: "",
    loading: true,
    pageRendering: false,
    showBottom: window.screen.height > 500 ? true : false,
  }),
  computed: {
    ...mapGetters(["getBookById"]),
    book() {
      const id = this.$route.params.id;
      const book = this.getBookById(id);
      return book;
    },
    categories() {
      const cat = this.book.author.list.categories;
      if (cat.length) return cat.reduce((acc, att) => acc.concat(", ", att));
      return "";
    },
  },
  methods: {
    ...mapActions(["downloadBook", "deleteBook", "updatePage"]),
    increase() {
      if (!this.pageRendering) this.renderPage(this.pageNum);
      this.scale = this.scale + 0.05;
    },
    decrease() {
      if (!this.pageRendering) this.scale = this.scale - 0.05;
      this.renderPage(this.pageNum);
    },
    prev() {
      if (this.pageNum > 1 && !this.pageRendering) {
        this.pageNum--;
        const canvas = document.getElementById("the-canvas");
        canvas.scrollIntoView({ block: "end" });
      }
    },
    next() {
      if (this.pageNum < this.pdf.numPages && !this.pageRendering) {
        this.pageNum++;
        const canvas = document.getElementById("the-canvas");
        canvas.scrollIntoView();
      }
    },
    async render() {
      // eslint-disable-next-line no-undef
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "//mozilla.github.io/pdf.js/build/pdf.worker.js";
      // eslint-disable-next-line no-undef
      const pdf = await pdfjsLib.getDocument(this.url).promise;
      this.pdf = pdf;
    },
    async renderPage(num) {
      this.pageRendering = true;

      const page = await this.pdf.getPage(num);
      const scales = { 1: 3.2, 2: 4 };
      const defaultScale = 3;
      const scale = scales[window.devicePixelRatio] || defaultScale;

      const viewport = page.getViewport({ scale: this.scale });

      const canvas = document.getElementById("the-canvas");
      const context = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const displayWidth = 1.7;
      canvas.style.width = `${(viewport.width * displayWidth) / scale}px`;
      canvas.style.height = `${(viewport.height * displayWidth) / scale}px`;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      const renderTask = page.render(renderContext);

      await renderTask.promise;
      this.pageRendering = false;
    },
    async prepareReading() {
      if (!this.book) this.$router.push({ name: "Listas" });
      if (this.book.path) {
        this.url = await this.downloadBook(this.book);
        this.pageNum = this.book.currentPage;
        this.slider = this.book.currentPage;
        await this.render();
        await this.renderPage(this.pageNum);
        this.loading = false;
      }
    },
    showBottomOnScroll() {
      const container = document.getElementById("canvas-container");
      const scrollTop = Math.round(container.scrollTop);
      const scrollTopMax = Math.round(
        container.scrollTopMax ||
          container.scrollHeight - container.clientHeight
      );
      if (scrollTop === scrollTopMax) this.showBottom = true;
    },
    close() {
      this.openBook = false;
      this.updatePage({ id: this.book.id, actualPage: this.pageNum });
    },
  },
  watch: {
    async pageNum(val) {
      this.slider = val;
      await this.renderPage(val);
    },
  },
  async mounted() {
    await this.prepareReading();
  },
};
</script>

<style>
.page-count {
  display: flex;
  width: 100%;
}
#content {
  display: flex;
}
</style>