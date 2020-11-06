<template>
  <svg
    class="icon"
    xmlns="http://www.w3.org/2000/svg"
    enable-background="new 0 0 24 24"
    :fill="color"
    width="24px" 
    height="24px"
  >
    <path v-for="(path, i) in icon.paths" :key="i" :d="path" />
    <circle
      v-for="(circle, i) in icon.circles"
      :key="i + 1"
      :cx="circle.cx"
      :cy="circle.cy"
      :r="circle.r"
    />
  </svg>
</template>

<script>
import icons from "@/assets/icons";
export default {
  name: "AppIcon",
  props: {
    name: String,
    color:  {
      type: String,
      default: () => "white",
    },
  },
  computed: {
    icon() {
      return icons[this.name];
    },
  },
};
</script>
<style scoped>
</style>