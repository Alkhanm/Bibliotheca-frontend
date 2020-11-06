<template>
  <v-app id="app">
    <TheHeader />
    <v-main id="app-main">
      <v-container fluid>
        <transition name="bounce" mode="out-in" appear>
          <router-view></router-view>
        </transition>
      </v-container>
    </v-main>
    <div v-show="info.message" id="alert-info">
      <v-card dark class="ma-2 grey darken-3" width="80%" max-width="350">
        <v-card-text  class="text-center" id="alert-content">
          <v-icon :color="info.type">{{info.type}}</v-icon>
          <div class="alert-text mt-2 pl-2 text-start">{{ info.message }}</div>
          <v-btn :color="info.type" text @click="action()">
            {{ info.actionName || "OK" }}
          </v-btn>
        </v-card-text>
      </v-card>
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
    info() {
      return this.$store.state.info;
    },
  },
  methods: {
    action() {
      const callback = this.info.callback;
      if (callback) callback();
      this.$store.commit("inform", "");
    },
  },
  mounted() {
    const userLocal = localStorage.getItem(USER_KEY);
    if (userLocal) this.$store.commit("addUser", JSON.parse(userLocal));
  },
};
</script>

<style scoped>
#app {
  background-image: linear-gradient(
    to top,
    rgb(145, 137, 137),
    rgba(47, 48, 51, 0.726)
  );
}
#alert-info {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
}
#alert-content {
  display: flex;
  justify-content: space-between;
}
.alert-text {
  flex: 1;
}
/*
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
} */
</style>
