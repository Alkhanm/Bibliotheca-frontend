<template>
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
</template>

<script>
export default {
  name: "Book",
  computed: {
   book() {
    const id = this.$route.params.id;
    return this.getBookById(id);
   },
   categories() {
      const cat = this.book.author.list.categories;
      if (cat.length) return cat.reduce((acc, att) => acc.concat(", ", att));
      return "Sem categorias";
    },
  },
};
</script>
