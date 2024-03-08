<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useCustomizerStore } from '@/stores/customizer';
import { useGlobalPopupStore } from '@/stores/global-popup';
import { onMounted } from 'vue';

import Header from '@/layouts/AppHeader.vue'
import Footer from '@/layouts/AppFooter.vue'
import { VSonner, toast } from 'vuetify-sonner'

const customizer = useCustomizerStore();
const popup = useGlobalPopupStore();

onMounted(() => {
  (window as any).popup = popup;
  (window as any).toast = toast;
});
</script>

<template>
  <v-app
    :theme="customizer.theme"
    :class="[customizer.theme]"
  >
    <!-- Global Popup -->
    <v-dialog
      v-model="popup.show"
      width="auto"
    >
      <v-alert
        class="global-popup"
        closable
        border="start"
        :icon="popup.icon"
        :title="popup.title"
        :text="popup.message"
        :type="popup.type"
        @click:close="popup.close()"
      />
    </v-dialog>

    <!-- Global Notify -->
    <VSonner
      position="top-right"
      :duration="5000"
    />

    <Header />

    <v-main>
      <v-container
        fluid
        class="page-wrapper pa-0"
      >
        <RouterView />
      </v-container>
    </v-main>

    <Footer />
  </v-app>
</template>

<style lang="scss" scoped>
.global-popup {
  @media (min-width: 600px) {
    min-width: 40vw;
  }
  min-width: 90vw;
}
</style>
