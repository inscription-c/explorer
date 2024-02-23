<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { default as dayjs } from 'dayjs';
import { default as relativeTime } from 'dayjs/plugin/relativeTime';
import { useInscriptionStore } from '@/stores/inscriptions';
import type { ContentProtocol, SortBy } from '@/types/Inscriptions';

import Item from '@/views/inscriptions/Item.vue';

dayjs.extend(relativeTime);

const route = useRoute();
const insStore = useInscriptionStore();

const address = ref('');
const tabs = ref([
  { name: 'All', value: 'all', loading: false },
  { name: 'C-BRC-20', value: 'c-brc-20', loading: false },
  { name: 'Cursed', value: 'cursed', loading: false },
]);
const tabSelected = computed(() => tabs.value.find((t) => t.value === tab.value)!);
const tab = ref('all');
const sorts = ref([
  {
    label: 'Newest',
    icon: 'mdi-sort-clock-ascending-outline',
    value: 'newest'
  },
  {
    label: 'Oldest',
    icon: 'mdi-sort-clock-descending-outline',
    value: 'oldest'
  }
]);
const sortSelected = computed(() => sorts.value.find((s) => s.value === sort.value)!);
const sort = ref('newest');
const sortLoading = ref(false);

onMounted(async () => {
  address.value = route.params.address as string;
  await insStore.searchInscriptions(address.value);
});

async function onChangeTab(tab: any) {
  tabSelected.value.loading = true;

  if (tab == 'cursed') {
    insStore.selectCharm(tab);
    insStore.selectContentProtocol('all');
  } else {
    insStore.selectCharm('pure');
    insStore.selectContentProtocol(tabSelected.value.value as ContentProtocol);
  }

  await insStore.searchInscriptions(address.value);

  tabSelected.value.loading = false;

  return true
}

async function onChangeSort(sortValue: any) {
  sortLoading.value = true;

  sort.value = sortValue;
  insStore.selectSortBy(sortValue as SortBy);
  await insStore.searchInscriptions(address.value);

  sortLoading.value = false;
}

async function onChangePage(page: number) {
  insStore.selectPage(page, insStore.limit);
  await insStore.searchInscriptions(address.value);
}
</script>

<template>
  <v-container>
    <v-row class="mt-4">
      <v-col cols="12" class="d-flex justify-center order-sml-first">
        <div class="text-center top-spacer overflow-hidden">
          <p class="mt-3 text-sm-h3 text-h5">Address</p>
          <p class="address text-sm-h1 text-h4">{{ address }}</p>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-tabs color="primary" align-tabs="center" v-model="tab" @update:modelValue="onChangeTab">
          <v-tab v-for="item in tabs" :key="item.name" :value="item.value" :loading="item.loading">
            {{ item.name }}
          </v-tab>
        </v-tabs>
        <v-divider></v-divider>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="d-flex justify-space-between" cols="12">
        <h3><span class="text-success">{{ insStore.total.toLocaleString() }}</span> inscriptions</h3>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn color="primary" :prepend-icon="sortSelected.icon" :loading="sortLoading" v-bind="props">{{ sortSelected.label }}</v-btn>
          </template>

          <v-list>
            <v-list-item v-for="item in sorts" :key="item.value"
              density="compact"
              :value="item.value"
              :prepend-icon="item.icon"
              :title="item.label"
              @click="onChangeSort(item.value)">
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="3" sm="6" v-for="item in insStore.inscriptions" :key="item.inscription_id">
        <Item :meta="item" />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-pagination
          v-if="Math.ceil(insStore.total / insStore.limit) > 1"
          v-model="insStore.page"
          class="my-4"
          :length="Math.ceil(insStore.total / insStore.limit)"
          :disabled="insStore.loading"
          @update:modelValue="onChangePage"
        ></v-pagination>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.v-container {
  max-width: 1200px !important;
}

.address {
  width: 100%;
  overflow: hidden;
  overflow-wrap: break-word;
  word-break: break-all;
}
</style>
