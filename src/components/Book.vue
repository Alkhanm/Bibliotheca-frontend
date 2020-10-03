<template>
<v-container>
  <v-card id="library" class="mx-auto pa-2" dark max-width="1000">
    <v-card-title>
      <p>{{ book.title }}</p>
      <v-spacer></v-spacer>
    <BookActions :book="book"></BookActions>
    </v-card-title>
    <v-card-subtitle class="text-capitalize">
      Autor: {{ book.author.name }}
    </v-card-subtitle>
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
          max-width="30%" />
        <PDFReader 
          :book="book" 
          :pdfURL="pdfURL"></PDFReader>
        </template>
        <p id="text-about-book" class="text-start pl-5 pr-5">
          {{book.about}}
        </p>
        <span class="text-end">
          <div>Lista: {{ book.author.list.name }}</div>
          <div>Categorias: {{ categories }}</div>
          <div>Última leitura: {{ book.lastReading }}</div>
        </span>
    </v-card-text>
    <v-btn @click="$router.back()" text min-width="13%">
      <v-icon>keyboard_return</v-icon>
    </v-btn>
  </v-card>
</v-container>
</template>

<script>
import BookActions from "./BookActions"
import PDFReader from "./PDFReader"
import { mapActions, mapGetters, mapMutations } from "vuex";
import { downloadBook } from "@/services/storage"

export default {
  name: "Book",
  components: { BookActions, PDFReader }, 
  data: () => ({ pdfURL: '' , imgURL: '', loading: null }),
  computed: {
    ...mapGetters(["getBookById"]),
    book() {
      const id = this.$route.params.id;
      return this.getBookById(id);
    },
    categories() {
      const cat = this.book.author.list.categories;
      if (cat.length) return cat.reduce((acc, att) => acc.concat(", ", att));
      return "Sem categorias";
    },
    hasPDF(){ return !!this.book.path }
  },
  methods: {
    ...mapActions(["deleteBook"]),
    ...mapMutations(["openBook"]),
    async getArchives(){
      this.loading = true
      const { img, pdf } = await downloadBook(this.book);
      this.imgURL = img
      this.pdfURL = pdf
      this.loading = false
    }
  },
  async created() {
    if (!this.book) this.$router.push({name: "Listas"})
    if (this.hasPDF) await this.getArchives()  
  }
};
</script>
<style>
#content { display: flex; justify-content: space-between; }
.text-content{
  display: flex;
}
#text-about-book {
  flex:1;
}
.image-book{ cursor: pointer; }
</style>