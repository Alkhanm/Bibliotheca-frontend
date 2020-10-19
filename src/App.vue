<template>
  <v-app id="app">
    <TheHeader />
    <v-main id="app-main">
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
    <div v-show="info" id="alert-info">
      <v-alert
        dark
        class="grey darken-3"
        border="top"
        dismissible
        :type="info.type"
        max-width="1000"
      >{{info.message}}</v-alert>
    </div>
  </v-app>
</template>

<script>
import TheHeader from "./components/TheHeader";
import { USER_KEY } from "./services/constants";
export default {
  name: "app",
  components: { TheHeader },
  computed: {
    info() { return this.$store.state.info },
  },
  mounted() {
    const userLocal = localStorage.getItem(USER_KEY);
    if (userLocal) this.$store.commit("addUser", JSON.parse(userLocal));
    window.scrollTo(0,200)
  },
};
</script>

<style>
@keyframes move-in {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0%);
  }
}
@keyframes move-out {
  from {
    transform: translateY(0%);
  }
  to {
    transform: translateY(100%);
  }
}
.move-enter-active {
  animation: move-in 0.3s ease;
  transition: opacity 0.3s;
}
.move-leave-active {
  animation: move-out 0.3s ease;
  transition: opacity 0.3s;
}
.move-enter,
.move-leave-to {
  opacity: 0;
}
#alert-info {
  position: fixed;
  z-index: 4;
  bottom: 0;
  display: flex;
  left: 0;
  justify-content: center;
  width: 100%;
}
</style>
