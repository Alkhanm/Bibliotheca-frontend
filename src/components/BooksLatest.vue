<template>
  <div id="book-latest">
    <v-card
      v-if="currentBook.path"
      :loading="!img"
      :to="{ name: 'Leitura', params: { id: currentBook.id } }"
      class="mx-auto"
      max-width="60"
    >
      <v-img lazy-src="../assets/img/test-img_.jpg" width="60" :src="img" />
    </v-card>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { downloadIMG } from "@/services/storage";

export default {
  data: () => ({ img: "" }),
  computed: {
    currentBook() {
      const book = this.$store.state.book.currentBook;
      return book;
    },
  },
  methods: mapActions(["fetchLastBook"]),
  async mounted() {
    await this.fetchLastBook();
    if (this.currentBook.path) this.img = await downloadIMG(this.currentBook.path);
  },
};
</script>
<style scoped>
#book-latest {
  cursor: pointer;
  right: 0;
  padding-right: 5px;
}
</style>