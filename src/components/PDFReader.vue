<template>
  <v-dialog
    id="pdf-reader"
    v-model="open"
    fullscreen
    eager
    attach="#library"
    scrollable
  >
    <template v-slot:activator="{ on, attrs }">
      <v-img
        v-bind="attrs"
        v-on="on"
        :src="imgURL"
        class="image-book"
        max-width="30%"
      />
    </template>

    <v-card dark class="mx-auto" :loading="loading">
      <span v-if="loading" class="load-button">
        <v-btn class="ma-2" fab loading></v-btn>
      </span>
      <v-card-text
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
          <div class="space"></div>
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
            :max="reading.totalPages"
          >
          </v-slider>
          <v-btn @click="next()">
            <v-icon>navigate_next</v-icon>
          </v-btn>
          <span class="mt-5">{{ `${pageNum}/${reading.totalPages}` }}</span>
          <v-btn @click="toggleFullscreen()" class="full-screen-bottom">
            <v-icon>aspect_ratio</v-icon>
          </v-btn>
          <v-btn @click="close()">
            <v-icon>keyboard_return</v-icon>
          </v-btn>
          <div class="space"></div>
        </div>
      </transition>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import { renderPDF, renderPage } from "@/services/PdfService";

export default {
  name: "PDFReader",
  props: {
    reading: { type: Object, required: true },
    pdfURL: { type: String, required: true },
    imgURL: { type: String, required: true },
  },
  data() {
    return {
      pdf: {},
      showOptions: false,
      slider: 0,
      scale: 0,
      pageNum: 0,
      loading: true,
      pageRendering: false,
      firstTouch: "",
      showBottom: true,
      open: false,
      orientation: window.screen.orientation,
    };
  },
  computed: {
    isSmallDevice() {
      return window.screen.height / window.devicePixelRatio < 500;
    },
    openInFullScreen() {
      return this.$store.state.fullScreen;
    },
  },
  methods: {
    ...mapActions(["updateReading"]),
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
      if (this.pageNum < this.reading.totalPages && !this.pageRendering)
        this.pageNum++;
    },
    movePageOnTouch(event) {
      const container = document.getElementById("canvas-container");
      const top = Math.floor(container.scrollTop);
      const topMax =
        container.scrollTopMax ||
        container.scrollHeight - container.clientHeight;
      if (top != 0 && top != topMax) return;
      const valueOfPercent = 50;
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
        await renderPage(this.pdf, num, this.scale, "the-canvas");
        const canvas = document.getElementById("the-canvas");
        canvas.scrollIntoView({ inline: "center" });
      } catch (err) {
        console.error(err);
      } finally {
        this.pageRendering = false;
      }
    },
    async prepareReading() {
      try {
        this.pdf = await renderPDF(this.pdfURL);
        this.scale = this.reading.zoom;
        this.slider = this.pageNum = this.reading.page;
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
      if (top < topMax && this.isSmallDevice) this.showBottom = false;
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
    exitFullscreen() {
      if (!this.openInFullScreen && document.fullscreenElement)
        document.exitFullscreen();
      screen.orientation.lock(this.orientation.type);
    },
    toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else this.exitFullscreen();
      screen.orientation.lock("landscape-primary");
    },
    async update() {
      const reading = { ...this.reading };
      reading.lastReading = Date.now();
      reading.page = this.pageNum;
      reading.zoom = this.scale;
      await this.updateReading(reading);
    },
    close() {
      this.open = false;
      this.exitFullscreen();
      this.update();
    },
  },
  watch: {
    async pageNum(newValue) {
      if (!this.pageRendering) {
        this.showBottom = true;
        this.slider = newValue;
        await this.getPage(newValue);
      }
    },
  },
  async mounted() {
    await this.prepareReading();
  },
};
</script>

<style scoped>
#bottom {
    display: flex;
    height: 56px;
    width: 100%;
    position: fixed;
    background-color: #2e2e2e;
    bottom: 0;
    z-index: 4;
    justify-content: space-between;
}

#bottom button {
    height: 100%;
    background-color: transparent;
    box-shadow: none;
}

.space {
    width: 15%;
}

#space-between {
    height: 56px;
}

@media (max-width: 500px) {
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
</style>