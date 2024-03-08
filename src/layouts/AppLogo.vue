<script setup>
import { computed } from "vue";
import { useCustomizerStore } from "@/stores/customizer";

const customizer = useCustomizerStore();

//const dark = ref(false);
const dark = computed(() => {
  if (
    customizer.theme === "DARK_BLUE_THEME" ||
    customizer.theme === "DARK_AQUA_THEME" ||
    customizer.theme === "DARK_ORANGE_THEME" ||
    customizer.theme === "DARK_PURPLE_THEME" ||
    customizer.theme === "DARK_GREEN_THEME" ||
    customizer.theme === "DARK_CYAN_THEME"
  ) {
    return true;
  } else {
    return false;
  }
});
</script>

<template>
  <RouterLink
    class="text-h1 text-primary text-decoration-none"
    to="/"
  >
    C-INS
  </RouterLink>
</template>
