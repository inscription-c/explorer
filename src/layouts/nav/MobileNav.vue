<script setup lang="ts">
import { ref } from 'vue';
import { useCustomizerStore } from '@/stores/customizer';

import Logo from '@/layouts/Logo.vue';

const customizer = useCustomizerStore();
const isDark = ref(false)

function changeTheme() {
  if (!isDark.value) {
    isDark.value = true
    customizer.SET_THEME('DARK_BLUE_THEME')
  } else {
    isDark.value = false
    customizer.SET_THEME('BLUE_THEME')
  }
}
</script>

<template>
  <div class="pt-6 lp-mobile-sidebar">
    <div class="ml-6 mb-3">
      <Logo />
    </div>

    <v-list class="py-0 px-2">
      <v-list-item rounded="md">
        <v-btn variant="text" color="primary" class="custom-hover-primary nav-links" href="/inscriptions"> Inscriptions </v-btn>
        <!-- <v-btn variant="text" color="primary" class="custom-hover-primary nav-links"
          href="/inscriptions?filter=c-brc-20">C-BRC-20</v-btn> -->
        <v-btn variant="text" color="primary" class="custom-hover-primary nav-links" href="https://github.com/inscription-c/insc/wiki/HTTP-API-Reference" target="_blank">Document</v-btn>
        <v-switch
          class="v-input--hide-message px-4"
          color="primary"
          true-icon="mdi-brightness-4"
          false-icon="mdi-brightness-7"
          :model-value="isDark"
          @update:modelValue="changeTheme"
        ></v-switch>
      </v-list-item>
    </v-list>
  </div>
</template>
