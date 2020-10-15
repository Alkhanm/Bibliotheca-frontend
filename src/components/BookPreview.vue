<template>
  <v-card id="book-preview" dark max-width="300" class="mb-3">
    <v-card-title>
      <h5 class="text-capitalize text-right">{{ book.title }}</h5>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text @click="toBook()" class="pa-4 image-book">
      <v-btn v-if="loading" loading block text></v-btn>
      <v-img v-else-if="img" class="ma-2" :src="img" />
      <span class="text-center" v-else>
        Imagem indisponivel
        <v-icon>broken_image</v-icon>
      </span>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn @click="toBook()" text>
        <v-icon>open_in_new</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { downloadIMG } from "@/services/storage";

export default {
  name: "BookPreview",
  props: { book: Object },
  data: () => ({
    img: "",
    loading: true,
  }),
  methods:{
    toBook(){
      this.$router.push({ name:'Leitura', params: { id: this.book.id } })
    }
  },
  async mounted() {
    if (this.book.path) this.img = await downloadIMG(this.book);
    this.loading = false;
  },
};
</script>

<style>
#book-preview {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.image-book:hover{
  cursor: pointer;
}
</style>