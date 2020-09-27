<template>
  <v-card dark>
    <v-card-title class="headline text-md-subtitle-1">{{book.title}}</v-card-title>
    <v-card-subtitle class="text-capitalize">Autor: {{book.author.name}}</v-card-subtitle>
    <v-card-text class="text-end text-capitalize">
      Lista: {{book.author.list.name}}
      <p>{{categories}}</p>
      <p>{{book.about}}</p>
    </v-card-text>
    <slot></slot>
  </v-card>
</template>

<script>
export default {
  name: "Book",
  props: {
    book: {
      type: Object,
      required: true,
    },
  },
  computed: {
    categories() {
      const cat = this.book.author.list.categories;
      return cat.reduce((acc, att) => acc.concat(", ", att));
    },
  },
};
</script>

<style>
</style>