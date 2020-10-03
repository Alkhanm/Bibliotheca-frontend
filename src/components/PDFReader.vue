<template>
    <v-dialog v-model="open" scrollable eager fullscreen>
      <v-card  class="mx-auto">
        <v-btn v-if="loading" loading></v-btn>
        <v-card-text 
          v-show="!loading" 
          @scroll="showBottomOnScroll($event)" 
          @touchstart="firstTouch = $event"
          @touchend="touchesMoves($event)"
          @dblclick="showBottom = !showBottom"
          id="canvas-container" class="text-center pa-0">
          <canvas id="the-canvas"></canvas>
          <div id="space-between"></div>
        </v-card-text>
        <v-bottom-navigation dark :input-value="showBottom" fixed hide-on-scroll >
         <v-spacer class="space"></v-spacer>
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
            <v-slider 
              @change="pageNum = slider"
              v-model="slider"
              class="counter mt-7"
              color="blue"
              min="1"
              thumb-size="24"
              thumb-label="always"
              :max="totalPages" />
          <v-btn @click="next()">
            <span>Próximo</span>
            <v-icon>navigate_next</v-icon>
          </v-btn>
          <span class="mt-7">{{ `${pageNum}/${totalPages}` }}</span>
          <v-btn x-small @click="close()">
            <span class="mr-2">Sair</span>
            <v-icon>keyboard_return</v-icon>
          </v-btn>
          <v-spacer class="space"></v-spacer>
        </v-bottom-navigation>
      </v-card>
    </v-dialog>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import { renderPDF, renderPage } from "@/services/PdfService"

export default {
  name: "PDFReader",
  props: { 
    book: { type: Object, required: true }, 
    pdfURL: { type: String, required: true } 
  },
  data: () => ({
    pdf: {},
    showOptions: false,
    slider: 0,
    scale: 2.9,
    pageNum: 0,
    totalPages: 0,
    loading: true,
    pageRendering: false,
    showBottom: window.screen.width > 500 ? true : false,
    firstTouch: ''
  }),
  computed: {
    open() { return this.$store.state.open}
  },
  methods: {
    ...mapActions(["updatePage"]), 
    ...mapMutations(["openBook"]),
    increase() {
      this.scale = this.scale + 0.05;
      if (!this.pageRendering) this.getPage(this.pageNum);
    },
    decrease() {
      this.scale = this.scale - 0.05;
      if (!this.pageRendering) this.getPage(this.pageNum);
    },
    prev() { if (this.pageNum > 1) this.pageNum--;},
    next() { if (this.pageNum < this.totalPages) this.pageNum++; },
    touchesMoves(event){
      const percent =  (screen.height / 100) * 30
      const firstTouch = this.firstTouch.touches[0].clientY
      const lastTouch = event.changedTouches[0].clientY
      const movementDown = firstTouch - lastTouch
      if (movementDown >= percent && this.showBottom) 
        return this.next()
      const movementUp = movementDown * -1
      const container = document.getElementById("canvas-container");    
      if (movementUp >= percent && firstTouch <= lastTouch && container.scrollTop === 0)
        return this.prev()
    },
    test(event){
      console.log(event)
    },
    async getPage(num){
      try {
        this.pageRendering = true
        await renderPage(this.pdf, num, "the-canvas", this.scale);
      } catch(err) {
        this.$store.dispatch("notify", {...err})
      } finally{
         this.pageRendering = false
      }
    },
    async prepareReading() {
      try {
        this.pdf = await renderPDF(this.pdfURL)
        this.totalPages = this.pdf.numPages
        this.slider = this.pageNum = this.book.currentPage;
      } catch(err) { 
        this.$store.dispatch("notify", {...err}) 
      } finally { this.loading = false }
    },
    showBottomOnScroll() {
      const container = document.getElementById("canvas-container");
      const top = Math.round(container.scrollTop);
      const topMax = Math.round(container.topMax || container.scrollHeight - container.clientHeight);
      //Para telas pequenas, a barra se opções será oculta na navegação
      if (top > 0 && top < topMax && screen.height < 1000) this.showBottom = false;
      //Ao chegar no fim da página, mostre a barra
      if (top >= (topMax - 50)) this.showBottom = true;
    }, 
    close() {
      this.openBook(false)
      this.book.currentPage = this.pageNum
      this.updatePage({ id: this.book.id, currentPage: this.pageNum });
    },
  },
  watch: {
    async pageNum(newValue, oldValue) {
      if (!this.pageRendering) {
        this.slider = newValue;
        const canvas = document.getElementById("the-canvas")
        if (newValue > oldValue) canvas.scrollIntoView()
        else canvas.scrollIntoView({block: "end"})
        await this.getPage(newValue)
      }
    },
  },
  mounted() {
    this.prepareReading();
  },
};
</script>

<style>
#content { display: flex; justify-content: space-between; }
#space-between{ height: 50px;}
.page-count { display: flex; width: 100%; }
.text-content{ flex: 1; }
.image-book{ cursor: pointer; }
@media (max-width: 600px) {
 .counter { display: none !important; }
}
@media (display-mode: fullscreen){}

@media (max-width: 1200px) {
    .space { display: none; }
}
</style>