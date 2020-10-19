<template>
  <div id="book-latest">
    <v-card
      :loading="!img"
      :to="{ name: 'Leitura', params: { id: currentBook.id } }"
      class="mx-auto"
      max-width="60"
    >
      <v-img :src="img" />
    </v-card>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { downloadIMG } from "@/services/storage";

export default {
  data: () => ({ img: "" }),
  computed: {
    currentBook(){
      return this.$store.state.book.currentBook
    }
  },
  methods: {
    ...mapActions(["fetchLastBook"]),
  },
  async mounted() {
    await this.fetchLastBook();
    if (this.currentBook.path) 
      this.img = await downloadIMG(this.currentBook);
  },
};
</script>
<style>
#book-latest {
  cursor: pointer;
  right: 0;
  padding-right: 5px;
}
</style>