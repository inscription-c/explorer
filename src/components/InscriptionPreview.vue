<script setup lang="ts">
import { ref, computed, defineProps, onMounted } from 'vue';
import type { Inscription } from '@/types/Inscriptions';
import { useInscriptionStore } from '@/stores/inscriptions';
import config from '@/config';

const props = defineProps<{
  meta: Inscription;
}>();
const chainName = computed(() => {
  if (props.meta.c_ins_description.type === 'blockchain') {
    return props.meta.c_ins_description.chain_name;
  } else {
    return 'Ordinals';
  }
});

const store = useInscriptionStore();
const loading = ref(true);
const serial_number = props.meta?.inscription_number.toLocaleString();
let content = ref<any>(null);
const serverUrl = ref(config.serverUrl);

const contentType = computed(() => {
  if (props.meta.content_type.startsWith('image')) {
    return 'image';
  } else if (props.meta.content_type.includes('html')) {
    return 'html';
  } else {
    return 'text';
  }
});

onMounted(async () => {
  if (contentType.value === 'text') {
    content.value = await store.fetchContentById(props.meta!.inscription_id);
  }
  loading.value = false;
});
</script>

<template>
  <v-card variant="outlined" class="rounded overflow-hidden">
    <router-link :to="`/inscription/${meta!.inscription_id}`">
      <v-responsive v-if="contentType === 'image'" aspect-ratio="1">
        <v-img aspect-ratio="1/1" cover :src="`${serverUrl}/content/${meta.inscription_id}`" />
      </v-responsive>
      <v-responsive v-else-if="contentType === 'html'" aspect-ratio="1">
        <iframe
          class="w-100 h-100"
          frameborder="0"
          loading="lazy"
          sandbox="allow-scripts"
          :src="`${serverUrl}/content/${meta!.inscription_id}`">
        </iframe>
      </v-responsive>
      <v-responsive v-else aspect-ratio="1">
        <div v-if="content" class="ins-content h-100 d-flex flex-column align-center justify-center">
          <h3 class="text-primary">{{ content.tick }}</h3>
          <h4 class="text-success">{{ content.op }} {{ content.max }}</h4>
        </div>
      </v-responsive>
      <v-card-item class="pa-3">
        <h6 class="text-h6">#{{ serial_number }}</h6>

        <div class="d-flex align-center justify-space-between mt-1">
          <p class="text-body-2 font-weight-bold text-secondary">{{ meta.content_protocol ? meta.content_protocol.toUpperCase() : 'Unkown' }}</p>
          <p class="text-body-2 font-weight-bold text-success">{{ chainName }}</p>
        </div>
      </v-card-item>
    </router-link>
  </v-card>
</template>

<style lang="scss" scoped>
.ins-content {
  background-color: rgb(var(--v-theme-lightprimary));
}

.v-card-item {
  h6 {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
