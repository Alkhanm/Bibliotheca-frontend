<template>
  <v-container>
    <v-card id="library" class="mx-auto pa-2" dark max-width="1000">
      <v-card-title>
        <p>{{ book.title }}</p>
        <v-spacer></v-spacer>
        <v-menu :close-on-content-click="false" offset-y left transition="slide-y-transition" >
         <template v-slot:activator="{ on, attrs }">
          <v-btn color="grey darken-3" dark v-bind="attrs" v-on="on">
            <v-icon>view_headline </v-icon>
          </v-btn>
         </template>
        <v-card id="actions" dark>
          <v-list class="grey darken-3">
             <v-subheader>Opções de leitura</v-subheader>
             <v-list-item>
               <v-list-item-title>Ler</v-list-item-title>
               <v-btn @click="openBook = true" :disabled="!hasPDF || loading" text >
                <v-icon title="Ler">menu_book</v-icon>
              </v-btn>
             </v-list-item>
            <v-list-item>
              <v-list-item-title class="mr-2">Marcar como lido</v-list-item-title>
              <v-btn text> 
               <v-icon title="">library_add_check</v-icon>
              </v-btn>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Adicionar descrição</v-list-item-title>
              <v-btn text>
                <v-icon>notes</v-icon>
              </v-btn>
            </v-list-item>
            <v-list-item>
              <v-list-item-title class="mr-2">Mudar de lista</v-list-item-title>
              <v-btn append text>
                <v-icon>library_books</v-icon>
              </v-btn>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list class="grey darken-3">
            <v-subheader>Opções do livro</v-subheader>
             <v-list-item>
               <v-list-item-title class="mr-2">Alterar o arquivo</v-list-item-title>
               <v-btn append text>
                <v-icon>picture_as_pdf</v-icon>
              </v-btn>
            </v-list-item>
            <v-list-item>
              <v-list-item-title class="mr-2">Excluir</v-list-item-title>
              <v-btn append text>
                <v-icon>delete</v-icon>
              </v-btn>
            </v-list-item>
          </v-list>
        </v-card>
        </v-menu>
      </v-card-title>
      
      <v-card-subtitle class="text-capitalize"> 
        Autor: {{ book.author.name }}
      </v-card-subtitle>
      <v-card-text id="content" class="text-capitalize">
        <div v-if="loading">
          <v-btn large fab loading></v-btn>
          <p class="mr-2">Aguarde...</p>
        </div>
        <v-img @click="openBook = true" :src="urlImg" v-else class="image-book" max-width="30%" />
        <div class="text-content text-end ml-5">
          <span>Lista: {{ book.author.list.name }}</span>
          <p>Categorias: {{ categories }}</p>
          <p class="text-start">{{ book.about }}</p>
        </div>
      </v-card-text>
      <v-btn @click="$router.back()" text min-width="13%"><v-icon>keyboard_return</v-icon></v-btn>
    </v-card>
        
    <v-dialog v-model="openBook" scrollable eager fullscreen>
      <v-card dark class=" mx-auto">
        <v-card-text
          @scroll="showBottomOnScroll($event)"
          @dblclick="showBottom = !showBottom"
          id="canvas-container" class="text-center pa-0" >
          <canvas id="the-canvas"></canvas>
        </v-card-text>
        <v-bottom-navigation :input-value="showBottom" app>
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
              class="counter mt-7"
              color="blue"
              v-model="slider"
              min="1"
              thumb-size="24"
              thumb-label="always"
              :max="totalPages"
            ></v-slider>
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

  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { downloadBook } from "@/config/services/storage"
import { renderPDF, renderPage } from "@/config/services/PdfService"
export default {
  name: "Library",
  data: () => ({
    openBook: false,
    pdf: {},
    showOptions: false,
    slider: 0,
    scale: 3.1,
    pageNum: 0,
    totalPages: 0,
    urlImg: "",
    loading: true,
    pageRendering: false,
    showBottom: window.screen.width > 500 ? true : false,
  }),
  computed: {
    ...mapGetters(["getBookById"]),
    book() {
      const id = this.$route.params.id;
      return this.getBookById(id);

    },
    hasPDF(){ return !!this.book.path },
    categories() {
      const cat = this.book.author.list.categories;
      if (cat.length) 
        return cat.reduce((acc, att) => acc.concat(", ", att));
      return "Sem categorias";
    },
  },
  methods: {
    ...mapActions(["deleteBook", "updatePage"]),
    increase() {
      this.scale = this.scale + 0.05;
      if (!this.pageRendering) this.getPage(this.pageNum);
    },
    decrease() {
      this.scale = this.scale - 0.05;
      if (!this.pageRendering) this.getPage(this.pageNum);
    },
    prev() {
      if (this.pageNum > 1) this.pageNum--;
    },
    next() {
      if (this.pageNum < this.totalPages) this.pageNum++;
    },
    async getPage(num){
      try {
        this.pageRendering = true
        const canvas = await renderPage(this.pdf, num, "the-canvas", this.scale);
        canvas.scrollIntoView()
      } catch(err) {
        alert(err)
      } finally{
         this.pageRendering = false
      }
    },
    async prepareReading() {
      try {
        const { imgURL, pdfURL } = await downloadBook(this.book);
        this.pdf = await renderPDF(pdfURL)
        this.urlImg = imgURL
        this.totalPages = this.pdf.numPages
        this.slider = this.pageNum = this.book.currentPage;
      } catch(err){
        console.error(err)
      } finally { this.loading = false }
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
      this.book.currentPage = this.pageNum
      this.updatePage({ id: this.book.id, currentPage: this.pageNum });
    },
  },
  watch: {
    async pageNum(num) {
      if (!this.pageRendering) {
        this.slider = num;
        await this.getPage(num)
      }
    },
  },
  created() {
    if (!this.book) this.$router.push({ name: "Listas" });
    if (this.hasPDF) this.prepareReading();
  },
};
</script>

<style >
#content { display: flex; justify-content: space-between; }
.page-count { display: flex; width: 100%; }
.text-content{ flex: 1; }
.image-book{ cursor: pointer; }

@media (max-width: 600px) {
    .counter { display: none; }
}
@media (max-width: 1200px) {
    .space { display: none; }
}
</style>