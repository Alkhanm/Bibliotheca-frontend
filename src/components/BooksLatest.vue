<template>
  <div id="book-latest" >
    <v-card :to="{name:'Leitura', params: { id: lastBook.id }}" class="mx-auto" max-width="60">
      <v-img :src="img" />
    </v-card>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { downloadIMG } from "@/services/storage";

export default {
  data: () => ({ lastBook: [], img: "" }),
  methods: {
    ...mapActions(["fetchLastBook"]),
  },
  async mounted() {
    this.lastBook = await this.fetchLastBook()
    this.img = await downloadIMG(this.lastBook)
  }
};
</script>
<style>
  #book-latest{
    cursor: pointer;
    right: 0;
    padding-right: 5px;
  } 
</style>