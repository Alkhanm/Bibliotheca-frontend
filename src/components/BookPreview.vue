<template>
  <v-card id="book-preview" dark width="300" class="mb-3">
    <v-card-title>
      <p class="text-capitalize">{{ book.title }}</p>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text @click="toBook()" class="pa-4 image-book">
      <v-btn v-if="loading" loading block text></v-btn>
      <v-img contain v-else-if="img" class="ma-2" :src="img" />
      <span class="text-center no-image-text" v-else>
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
    this.$emit("loading", true)
    if (this.book.path) 
      this.img = await downloadIMG(this.book.path);
    this.loading = false;
    this.$emit("loading", false)
  },
};
</script>

<style scoped>
#book-preview {
  display: flex;
  flex-direction: column;
}
.image-book{
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.image-book:hover{
  cursor: pointer;
}
</style>