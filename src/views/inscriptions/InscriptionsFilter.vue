<script setup lang="ts">
import { ref } from 'vue';
import { useInscriptionStore } from '@/stores/inscriptions';
import type { ContentType, SortBy, Charm } from '@/types/Inscriptions';

const store = useInscriptionStore();

const panel = ref([0, 1, 2]);
const sort = ref<SortBy>('newest');
const sorts = ref([
  {
    label: 'Newest',
    color: 'primary',
    value: 'newest'
  },
  {
    label: 'Oldest',
    color: 'secondary',
    value: 'oldest'
  }
]);
const contentType = ref<ContentType>('all');
const contentTypes = ref([
  {
    label: 'All',
    color: 'primary',
    value: 'all'
  },
  // {
  //   label: 'TXT',
  //   color: 'secondary',
  //   value: 'text'
  // },
  {
    label: 'IMAGE',
    color: 'success',
    value: 'image'
  },
  {
    label: 'HTML',
    color: 'warning',
    value: 'html'
  },
  {
    label: 'JSON',
    color: 'indigo-darken-3',
    value: 'json'
  },
])
const charm = ref<Charm>('pure');
const charmTypes = ref([
  {
    label: 'Pure',
    color: 'success',
    value: 'pure'
  },
  {
    label: 'Cursed',
    color: 'error',
    value: 'cursed'
  },
]);

async function onChangeSort () {
  if (store.loading) return false;

  console.log('Change sort to', sort.value);
  store.selectSortBy(sort.value);
  await store.fetchInscriptions();
}

async function onChangeFilter () {
  if (store.loading) return false;

  console.log('Change filter to', contentType.value);
  store.selectContentType(contentType.value);
  store.selectCharm(charm.value);
  await store.fetchInscriptions();
}
</script>

<template>
  <v-sheet class="pa-4 pt-1">
    <v-expansion-panels
      v-model="panel"
      multiple
    >
      <v-expansion-panel elevation="0">
        <v-expansion-panel-title class="font-weight-medium custom-accordion">
          <v-icon icon="mdi-sort" />
          Sort
        </v-expansion-panel-title>
        <v-expansion-panel-text class="acco-body">
          <v-radio-group
            v-model="sort"
            class="d-flex flex-column align-start"
            :disabled="store.loading"
            @update:model-value="onChangeSort"
          >
            <v-radio
              v-for="item in sorts"
              :key="item.value"
              :color="item.color"
              :label="item.label"
              :value="item.value"
              hide-details
            />
          </v-radio-group>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-divider />
      <v-expansion-panel elevation="0">
        <v-expansion-panel-title class="font-weight-medium custom-accordion">
          <v-icon icon="mdi-filter" />
          Content Type
        </v-expansion-panel-title>
        <v-expansion-panel-text class="acco-body">
          <v-radio-group
            v-model="contentType"
            class="d-flex flex-column align-start"
            :disabled="store.loading"
            @update:model-value="onChangeFilter"
          >
            <v-radio
              v-for="item in contentTypes"
              :key="item.value"
              :color="item.color"
              :label="item.label"
              :value="item.value"
              hide-details
            />
          </v-radio-group>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-divider />
      <v-expansion-panel elevation="0">
        <v-expansion-panel-title class="font-weight-medium custom-accordion">
          <v-icon icon="mdi-creation" />
          Charms
        </v-expansion-panel-title>
        <v-expansion-panel-text class="acco-body">
          <v-radio-group
            v-model="charm"
            class="d-flex flex-column align-start"
            :disabled="store.loading"
            @update:model-value="onChangeFilter"
          >
            <v-radio
              v-for="item in charmTypes"
              :key="item.value"
              :color="item.color"
              :label="item.label"
              :value="item.value"
              hide-details
            />
          </v-radio-group>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-sheet>
</template>

<style lang="scss">
.custom-accordion {
  padding: 18px 2px;

  min-height: 30px !important;

  .v-expansion-panel-title__overlay {
    background-color: transparent;
  }
}

.acco-body {
  .v-expansion-panel-text__wrapper {
    padding: 5px 0;
  }

  .v-input__control {
    width: 100%;
  }
}

.custom-radio-box {
  .v-selection-control-group {
    flex-wrap: wrap;
  }
}
</style>
