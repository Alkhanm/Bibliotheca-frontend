<template>
  <v-dialog v-model="opened" eager scrollable fullscreen>
    <v-card dark class="mx-auto" :loading="loading">
      <v-card-text
        v-show="!loading"
        @scroll="showBottomOnScroll($event)"
        @touchstart="firstTouch = $event"
        @touchend="movePageOnTouch($event)"
        @dblclick="openBottom(!showBottom)"
        id="canvas-container"
        class="text-center pa-0"
      >
        <canvas class="mx-auto" id="the-canvas"></canvas>
        <div id="space-between"></div>
      </v-card-text>
      <transition name="up">
        <div id="bottom" v-show="showBottom">
          <v-spacer class="space"></v-spacer>
          <v-btn @click="increase()" class="zoom">
            <v-icon small>add</v-icon>
          </v-btn>
          <v-btn @click="decrease()" class="zoom">
            <v-icon small>remove</v-icon>
          </v-btn>
          <v-btn @click="prev()">
            <v-icon>navigate_before</v-icon>
          </v-btn>
          <v-slider
            v-model="slider"
            @change="pageNum = slider"
            class="counter mt-7"
            color="blue"
            min="1"
            thumb-size="26"
            thumb-label="always"
            :max="totalPages"
          />
          <v-btn @click="next()">
            <v-icon>navigate_next</v-icon>
          </v-btn>
          <span class="mt-5">{{ `${pageNum}/${totalPages}` }}</span>
          <v-btn @click="close()">
            <v-icon>keyboard_return</v-icon>
          </v-btn>
          <v-spacer class="space"></v-spacer>
        </div>
      </transition>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import { renderPDF, renderPage } from "@/services/PdfService";
import { READING_STATUS } from "@/services/enums";

export default {
  name: "PDFReader",
  props: {
    book: { type: Object, required: true },
    pdfURL: { type: String, required: true },
  },
  data() {
    return {
      pdf: {},
      showOptions: false,
      slider: 0,
      scale: 2.8,
      pageNum: 0,
      totalPages: 0,
      loading: true,
      pageRendering: false,
      firstTouch: "",
      showBottom: window.screen.width > 500 ? true : false,
    };
  },
  computed: {
    opened() {
      return this.$store.state.open;
    },
  },
  methods: {
    ...mapActions(["updateBook"]),
    ...mapMutations(["openBook"]),
    increase() {
      this.scale = this.scale + 0.55;
      if (!this.pageRendering) this.getPage(this.pageNum);
    },
    decrease() {
      this.scale = this.scale - 0.15;
      if (!this.pageRendering) this.getPage(this.pageNum);
    },
    prev() {
      if (this.pageNum > 1 && !this.pageRendering) this.pageNum--;
    },
    next() {
      if (this.pageNum < this.totalPages && !this.pageRendering) this.pageNum++;
    },
    movePageOnTouch(event) {
      const container = document.getElementById("canvas-container");
      const top = Math.floor(container.scrollTop) + 10;
      const topMax =
        container.scrollTopMax ||
        container.scrollHeight - container.clientHeight;
      const valueOfPercent = 40;
      const percent = (screen.height / 100) * valueOfPercent;
      const firstTouch = this.firstTouch.touches[0].clientY;
      const lastTouch = event.changedTouches[0].clientY;
      const movementDown = firstTouch - lastTouch;
      const movementUp = movementDown * -1;
      if (movementDown >= percent && top >= topMax) return this.next();
      if (movementUp >= percent && top === 0) return this.prev();
    },
    async getPage(num) {
      try {
        this.pageRendering = true;
        await renderPage(this.pdf, num, "the-canvas", this.scale);
      } catch (err) {
        console.error(err);
      } finally {
        this.pageRendering = false;
      }
    },
    async prepareReading() {
      try {
        this.pdf = await renderPDF(this.pdfURL);
        this.totalPages = this.book.totalPages;
        this.slider = this.pageNum = this.book.currentPage;
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    showBottomOnScroll() {
      const container = document.getElementById("canvas-container");
      const top = Math.round(container.scrollTop);
      const topMax = Math.round(
        container.scrollHeight - container.clientHeight
      );
      //Para telas pequenas, a barra se opções será oculta na navegação
      if (top < topMax && screen.height < 500) this.showBottom = false;
      //Ao chegar no fim da página, mostre a barra
      if (top > topMax - 55 || top === 0) this.showBottom = true;
    },
    openBottom(value) {
      const container = document.getElementById("canvas-container");
      const top = Math.round(container.scrollTop);
      const topMax = Math.round(
        container.scrollHeight - container.clientHeight
      );
      if (top !== topMax) this.showBottom = value;
    },
    close() {
      this.openBook(false);
      const book = { ...this.book };
      book.lastReading = Date.now();
      book.currentPage = this.pageNum;
      if (!book.readingStatus) book.readingStatus = READING_STATUS.READING;
      this.updateBook(book);
    },
  },
  watch: {
    async pageNum(newValue) {
      if (!this.pageRendering) {
        const canvas = document.getElementById("the-canvas");
        canvas.scrollIntoView({ behavior: "smooth" });
        this.showBottom = true;
        await this.getPage(newValue)
        this.slider = newValue;
      }
    },
  },
  mounted() {
    this.prepareReading();
  },
};
</script>

<style>
#the-canvas {
  width: 100%;
}
#bottom {
  display: flex;
  height: 56px;
  width: 100%;
  position: fixed;
  background-color: #2e2e2e;
  bottom: 0;
  z-index: 4;
}

#bottom button {
  height: 100%;
  background-color: transparent;
  box-shadow: none;
}

#space-between {
  height: 50px;
}
.page-count {
  display: flex;
  width: 100%;
}
.image-book {
  cursor: pointer;
}
@media (max-width: 600px) {
  .counter {
    display: none;
  }
  .zoom {
    display: none;
  }
}
@media (max-width: 1200px) {
  .space {
    display: none;
  }
}

.up-enter-active,
.up-leave-active {
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.5, 1);
}
.up-enter,
.up-leave-to {
  opacity: 0;
  transform: translateY(56px);
}
</style>