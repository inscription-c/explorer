<script setup lang="ts">
import { ref } from 'vue';
import { useCustomizerStore } from '@/stores/customizer';

import AppLogo from '@/layouts/AppLogo.vue';

const customizer = useCustomizerStore();
const isDark = ref(false)

function changeTheme() {
  if (!isDark.value) {
    isDark.value = true
    customizer.setTheme('DARK_BLUE_THEME')
  } else {
    isDark.value = false
    customizer.setTheme('BLUE_THEME')
  }
}
</script>

<template>
  <div class="pt-6 lp-mobile-sidebar">
    <v-list class="py-0 px-2">
      <v-list-item rounded="md">
        <v-btn
          variant="text"
          color="primary"
          class="text-h6"
          href="/inscriptions"
        >
          Inscriptions
        </v-btn>
        <v-btn
          variant="text"
          color="primary"
          class="text-h6"
          href="/inscribe"
        >
          Inscribe
        </v-btn>
        <v-btn
          variant="text"
          color="primary"
          class="text-h6"
          href="https://docs.c-ins.com/"
          target="_blank"
        >
          Document
        </v-btn>
        <v-switch
          class="v-input--hide-message px-4"
          color="primary"
          true-icon="mdi-brightness-4"
          false-icon="mdi-brightness-7"
          :model-value="isDark"
          @update:model-value="changeTheme"
        />
      </v-list-item>
    </v-list>
  </div>
</template>
