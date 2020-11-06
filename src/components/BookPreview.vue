<template>
  <v-card shaped dark width="300" class="mb-3">
    <v-card-text class="preview-content">
      <div class="preview-content-text text-capitalize">
        <h4 class="subtitle-1">{{ serie }}</h4>
        <h2 class="title2">{{ book.title }}</h2>
        <div class="infos">
          <v-chip dark small class="mb-1" :text-color="status.color">{{
            status.name
          }}</v-chip>
          {{ lastRead }}
        </div>
      </div>
      <v-divider></v-divider>
      <div
        @click="$router.push(toBook())"
        class="preview-content-image mt-4 image-book"
      >
        <v-btn v-if="loading" loading block text></v-btn>
        <v-img contain v-else-if="img" :src="img" />
        <span class="text-center" v-else>
          <v-icon>broken_image</v-icon>
          <p>Imagem indisponivel</p>
        </span>
      </div>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="preview-actions">
      <v-btn :to="toBook()" text>
        <v-icon>open_in_new</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { downloadIMG } from "@/services/storage";
import { READING_STATUS } from "@/services/enums";
import { formatDate } from "@/services/utils";

export default {
  name: "BookPreview",
  props: { book: Object },
  data: () => ({
    img: "",
    loading: true,
  }),
  computed: {
    serie() {
      return this.book.serie ? this.book.serie.name : "";
    },

    status() {
      const status = this.book.read.status;
      return READING_STATUS[status];
    },
    lastRead() {
      return formatDate(this.book.read.lastRead);
    },
  },
  methods: {
    toBook() {
      return { name: "Leitura", params: { id: this.book.id } };
    },
  },
  async mounted() {
    this.$emit("loading", true);
    if (this.book.path) this.img = await downloadIMG(this.book.path);
    this.loading = false;
    this.$emit("loading", false);
  },
};
</script>

<style scoped>
.preview-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.preview-content-image {
  flex: 5;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.preview-content-text {
  flex: 1;
}
.infos{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>