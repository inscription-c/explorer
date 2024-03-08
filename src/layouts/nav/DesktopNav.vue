<script setup lang="ts">
import { ref } from 'vue';
import { useCustomizerStore } from '@/stores/customizer';

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
  <v-btn
    variant="text"
    color="primary"
    class="text-h5"
    href="/inscriptions"
  >
    Inscriptions
  </v-btn>
  <v-btn
    variant="text"
    color="primary"
    class="text-h5"
    href="/inscribe"
  >
    Inscribe
  </v-btn>
  <v-btn
    variant="text"
    color="primary"
    class="text-h5"
    href="https://github.com/inscription-c/insc/wiki/HTTP-API-Reference"
    target="_blank"
  >
    Document
  </v-btn>
  <v-switch
    class="v-input--hide-message"
    color="primary"
    true-icon="mdi-brightness-4"
    false-icon="mdi-brightness-7"
    :model-value="isDark"
    @update:model-value="changeTheme"
  />
</template>
