<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  loading: boolean;
}>();


</script>

<template>
  <v-row class="justify-center mt-10">
    <v-col v-if="loading" class="text-center py-16" lg="7">
      <v-icon class="empty-icon" icon="mdi-cloud-download"></v-icon>
      <h1 class="text-h1 mt-6">Loading</h1>
    </v-col>
    <v-col v-else class="text-center py-16" lg="7">
      <v-icon class="empty-icon" icon="mdi-timer-sand-empty"></v-icon>
      <h1 class="text-h1 mt-6">There is no Inscription yet</h1>
    </v-col>
  </v-row>
</template>

<style lang="scss">
.empty-icon {
  font-size: 140px;
}
</style>
