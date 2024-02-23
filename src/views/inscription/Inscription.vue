<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { default as dayjs } from 'dayjs';
import { default as utc } from 'dayjs/plugin/utc';
import { default as timezone } from 'dayjs/plugin/timezone';
import { useInscriptionStore } from '@/stores/inscriptions';
import type { Inscription, InscriptionDetail } from '@/types/Inscriptions';
import config from '@/config';
import { onUpdated } from 'vue';
import { toast } from 'vuetify-sonner';

dayjs.extend(utc);
dayjs.extend(timezone);

const route = useRoute();
const store = useInscriptionStore();

const loading = ref(true)
const browserDetail = ref<Inscription | null>(null);
const detail = ref<InscriptionDetail | null>(null);
const content = ref<any>(null);
const serverUrl = ref(config.serverUrl);

const fields = computed(() => {
  if (!detail.value) {
    return [];
  } else {
    const data: any = [
      {
        title: 'Inscription ID',
        value: detail.value.inscription_id,
        to: '',
      },
      {
        title: 'C-INS Type',
        value: cInsDesc.value?.type === 'blockchain' ? 'L2' : 'Ordinals',
        to: '',
      },
    ];

    if (browserDetail.value?.c_ins_description?.type === 'blockchain') {
      data.push({
        title: 'Contract',
        value: cInsDesc.value?.contract,
        to: '',
      });
    }

    return [
      ...data,
      {
        title: 'Owner',
        value: detail.value.address,
        to: '/address/' + detail.value.address,
      },
      {
        title: 'Content Type',
        value: detail.value.content_type,
        to: '',
      },
      {
        title: 'Content Size',
        value: `${detail.value.content_length.toLocaleString()} bytes`,
        to: '',
      },
      {
        title: 'Protocol Type',
        value: detail.value.content_protocol ? detail.value.content_protocol : 'Unknown',
        to: '',
      },
      {
        title: 'Review At Height',
        value: detail.value.genesis_height,
        to: '',
      },
      {
        title: 'Review At',
        value: dayjs(detail.value.timestamp * 1000).local().format('YYYY-MM-DD HH:mm:ss'),
        to: '',
      },
    ];
  }
});
const cInsDesc = computed(() => {
  return browserDetail.value?.c_ins_description
});
const contentType = computed(() => {
  if (detail.value?.content_type.startsWith('image')) {
    return 'image';
  } else {
    return 'text';
  }
});

onMounted(async () => {
  await loadInscription();
});

onUpdated(async () => {
  await loadInscription();
});

async function loadInscription() {
  const id = route.params.id as string;
  browserDetail.value = await store.fetchBrowserDetailById(id) ?? null
  detail.value = await store.fetchDetailById(id) ?? null;

  if (!detail.value?.content_type.startsWith('image')) {
    content.value = await store.fetchContentById(id);
  } else {
    content.value = null;
  }

  loading.value = false
}

const showRaw = ref(false)
function onShowRaw() {
  showRaw.value = !showRaw.value;
}

const shareLink = ref<any>(null)
const currentUrl = ref(window.location.href)
function copyLink() {
  shareLink.value.$el.querySelector('input').select();
  navigator.clipboard.writeText(currentUrl.value);
  toast.success('Link copied to clipboard');
}
</script>

<template>
  <v-container>
    <v-row class="mt-sm-5">
      <v-col cols="12" sm="6">
        <v-skeleton-loader v-if="loading" type="card"></v-skeleton-loader>
        <v-card v-else class="overflow-hidden" elevation="10" rounded>
          <template v-if="contentType === 'image'">
            <v-responsive :aspect-ratio="1">
              <v-img aspect-ratio="1/1" cover :src="`${serverUrl}/content/${detail?.inscription_id}`" />
            </v-responsive>
          </template>
          <template v-else>
            <v-responsive :aspect-ratio="1">
              <div v-if="content" class="img-place-holder d-flex flex-column align-center justify-center overflow-auto">
                <template v-if="!showRaw">
                  <h3 class="text-primary text-h1">{{ content.tick }}</h3>
                  <h4 class="text-secondary text-h3">{{ content.op }}</h4>
                </template>
                <template v-else>
                  <pre>{{ JSON.stringify(content, null, 2) }}</pre>
                </template>
              </div>
            </v-responsive>
            <div class="d-flex justify-end mr-4 mt-n7">
              <v-tooltip text="Show raw data" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-code-braces"
                    color="primary"
                    class="ml-auto"
                    size="large"
                    @click="onShowRaw"
                    >
                  </v-btn>
                </template>
              </v-tooltip>
            </div>
          </template>

          <v-card-item :class="{ 'pa-6': contentType === 'image' }">
              <h6 class="text-h6">Share</h6>

              <div class="d-flex align-center justify-space-between mt-2">
                <v-text-field
                  ref="shareLink"
                  variant="outlined"
                  color="primary"
                  readonly
                  hide-details
                  :value="currentUrl"
                  :append-inner-icon="'mdi-content-copy'"
                  @click="copyLink"
                  @click:appendInner="copyLink">
                </v-text-field>
              </div>
          </v-card-item>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6">
        <v-skeleton-loader v-if="loading || !detail" type="card"></v-skeleton-loader>
        <v-card v-else elevation="10">
          <v-card-item>
            <v-card-title class="text-h2">
              #{{ detail.inscription_number.toLocaleString() }}
            </v-card-title>

            <v-card-subtitle v-if="content && detail.content_protocol === 'c-brc-20'" class="text-h5">
              <v-icon icon="mdi-rocket-launch-outline"></v-icon>
              <template v-if="content.op === 'deploy'">
                {{ content.op }}
                <span class="text-secondary">{{ content.tick }}</span>
                to
                <span class="text-success">{{ cInsDesc?.chain_name }}</span>
              </template>
            </v-card-subtitle>

            <div class="fields mt-sm-5 mt-10">
              <div v-for="item in fields" :key="item.title" class="d-flex align-center mt-6">
                <div class="field-row">
                  <h5 class="text-body-2">{{ item.title }}</h5>
                  <p v-if="!item.to" class="text-h6 mt-1">{{ item.value }}</p>
                  <router-link v-else :to="item.to" class="text-h6 mt-1 text-primary">{{ item.value }}</router-link>
                </div>
              </div>
            </div>

          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.v-container {
  max-width: 1200px !important;
}

.img-place-holder {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: rgb(var(--v-theme-lightprimary));
}

.fields {
  .field-row {
    width: 100%;
    overflow: hidden;

    p {
      overflow: hidden;
      white-space: wrap;
    }
  }
}
</style>
