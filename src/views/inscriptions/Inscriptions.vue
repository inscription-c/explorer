<script setup lang="ts">
import { onMounted } from 'vue';
import { default as dayjs } from 'dayjs';
import { default as relativeTime } from 'dayjs/plugin/relativeTime';
import { useInscriptionStore } from '@/stores/inscriptions';

import AppBaseCard from '@/components/AppBaseCard.vue';
import InscriptionsFilter from '@/views/inscriptions/InscriptionsFilter.vue';
import Item from '@/views/inscriptions/Item.vue';
import Empty from '@/views/inscriptions/Empty.vue';

dayjs.extend(relativeTime);

const store = useInscriptionStore();

onMounted(async () => {
  await store.fetchInscriptions();
});
</script>

<template>
  <v-container>
    <AppBaseCard>
      <!-- -------------------------------------- -->
      <!-- Left Sidebar -->
      <!-- -------------------------------------- -->
      <template v-slot:leftpart>
        <InscriptionsFilter />
      </template>
      <!-- -------------------------------------- -->
      <!-- Right Side Content Part -->
      <!-- -------------------------------------- -->
      <template v-slot:rightpart>
        <perfect-scrollbar>
          <v-sheet class="pa-4">
            <div class="d-flex gap-2 align-center mb-4 justify-space-between">
              <h5 class="text-h5 d-none d-lg-flex font-weight-semibold">Inscriptions</h5>
            </div>

            <template v-if="store.inscriptions && store.inscriptions.length >= 1">
              <v-row>
                <v-col cols="12" lg="3" sm="6" v-for="item in store.inscriptions" :key="item.inscription_id">
                  <Item :meta="item" />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-pagination
                    v-if="store.pages > 1"
                    v-model="store.page"
                    class="my-4"
                    :length="store.pages"
                    :disabled="store.loading"
                    @update:modelValue="store.fetchInscriptions"
                  ></v-pagination>
                </v-col>
              </v-row>
            </template>
            <Empty v-else :loading="store.loading" />
          </v-sheet>
        </perfect-scrollbar>
      </template>
      <!-- -------------------------------------- -->
      <!-- Mobile Sidebar -->
      <!-- -------------------------------------- -->
      <template v-slot:mobileLeftContent>
        <InscriptionsFilter />
      </template>
    </AppBaseCard>
  </v-container>
</template>

<style lang="scss" scoped>
.v-container {
  max-width: 1200px !important;
}
</style>
