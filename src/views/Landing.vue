<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { default as dayjs } from 'dayjs';
import { default as relativeTime } from 'dayjs/plugin/relativeTime';
import { useInscriptionStore } from '@/stores/inscriptions';
import { useStatisticsStore } from '@/stores/statistics';
import { formatBytes } from '@/utils/format';
import config from '@/config';

import Search from '@/layouts/Search.vue';

dayjs.extend(relativeTime);

const insStore = useInscriptionStore();
const statisticsStore = useStatisticsStore();

const serverUrl = ref(config.serverUrl);

const latestInscriptions = computed(() => {
  const inscriptions = insStore.inscriptions;

  if (inscriptions && inscriptions?.length > 0) {
    return inscriptions.slice(0, 5).map((item) => {
      return {
        id: item.inscription_id,
        serial_number: item.inscription_number,
        content_type: item.content_type.toUpperCase(),
        content_length_text: `${item.content_length.toLocaleString()} bytes`,
        content_proto: 'C-BRC-20',
        image_url: '',
        review_at: dayjs(item.timestamp).fromNow(),
      };
    })
  } else {
    []
  }
});

const statistics = computed(() => {
  return [
    {
      title: 'Inscription',
      value: statisticsStore.inscriptions.toLocaleString(),
      icon: 'mdi-alpha-c-box-outline',
    },
    {
      title: 'Stored data',
      value: formatBytes(statisticsStore.stored_data),
      icon: 'mdi-database-check-outline',
    },
    {
      title: 'Total inscription fees',
      value: `${statisticsStore.total_fees.toLocaleString()} BTC`,
      icon: 'mdi-currency-btc',
    }
  ]
});

let timer: number;

onMounted(() => {
  loadLatestInscriptions();

  timer = setInterval(async () => {
    await loadLatestInscriptions();
  }, 3000);
});

onUnmounted(() => {
  clearInterval(timer);
});

async function loadLatestInscriptions() {
  insStore.reset();
  insStore.fetchInscriptions();
  statisticsStore.fetchStatistics();
}
</script>

<template>
  <div class="lp-wraper">
    <div class="overflow-hidden">
      <div class="search py-16 bg-lightprimary">
        <v-container>
          <v-row>
            <v-col class="d-flex justify-center">
              <h1>
                Explore C-INS on Bitcoin
              </h1>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col lg="6" md="8" sm="10" xs="12">
              <Search />
            </v-col>
          </v-row>
        </v-container>
      </div>

      <v-container>
        <v-row>
          <v-col cols="12" sm="6">
            <v-table class="latest-ins elevation-6 rounded-lg">
              <thead>
                <tr>
                  <th class="text-h3" colspan="3">Latest Inscriptions</th>
                </tr>
              </thead>
              <tbody>
                <tr class="ins-row" v-for="item in latestInscriptions" :key="item.id">
                  <td class="py-4">
                    <router-link :to="'/inscription/' + item.id">
                      <v-img v-if="item.content_type == 'IMAGE'" class="img-fluid" :width="80" aspect-ratio="1/1" cover :src="`${serverUrl}/content/${item.id}`" />
                      <div v-else class="ins-proto">{{ item.content_proto }}</div>
                    </router-link>
                  </td>
                  <td class="ins-2col py-4 px-0">
                    <router-link :to="'/inscription/' + item.id">
                      <h5 class="text-h5 font-weight-medium text-medium-emphasis text-secondary  text-truncate">
                        Inscription #{{ item.serial_number.toLocaleString() }}</h5>
                      <p class="text-body-1 font-weight-medium text-medium-emphasis">{{ item.content_type }} | {{
                        item.content_length_text }}</p>
                    </router-link>
                  </td>
                  <td class="py-4 d-sm-table-cell d-none">
                    <h6 class="text-body-1 text-right">{{ item.review_at }}</h6>
                  </td>
                </tr>
                <tr class="ins-row">
                  <td class="py-4 bg-primary" colspan="3">
                    <router-link class="text-h5 text-white text-decoration-none d-block width-100 text-center"
                      to="/inscriptions">
                      View all inscriptions
                      <v-icon icon="mdi-arrow-right"></v-icon>
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
          <v-col cols="12" sm="4" offset-sm="1">
            <div v-for="item in statistics" :key="item.title"
              class="statistics d-flex align-center justify-space-between rounded-md mb-6 pa-3 bg-primary">
              <div>
                <div class="text-h3 text-white">{{ item.value }}</div>
                <div class="text mt-1 text-white">{{ item.title }}</div>
              </div>
              <v-icon :icon="item.icon"></v-icon>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.v-container {
  max-width: 1200px !important;
}

.latest-ins {
  .ins-proto {
    width: 80px;
    height: 80px;
    background-color: rgb(var(--v-theme-lightprimary));
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: bolder;
    color: rgb(var(--v-theme-primary));
  }

  @media (max-width: 600px) {
    .ins-row > .ins-2col {
      max-width: 170px;
      padding-right: 16px !important;
    }
  }
}

.statistics {
  .v-icon {
    font-size: 140px;
  }
}
</style>
