<script setup lang="ts">
import { ref, defineProps } from 'vue';
import { useRouter } from 'vue-router';
import { useInscriptionStore } from '@/stores/inscriptions';
import { toast } from 'vuetify-sonner'

const props = defineProps<{
  class?: any,
  width?: string,
}>();

const router = useRouter();
const insStore = useInscriptionStore();

const searchText = ref('');

async function onSubmit () {
  if (insStore.loading) return false;
  const search = searchText.value.replace(',', '');

  try {
    let searchType = await insStore.searchInscriptions(search, false);
    searchType = searchType ? searchType : '';

    if (searchType === 'inscription_id') {
      if (insStore.inscriptions.length > 0) {
        const ins = insStore.inscriptions[insStore.inscriptions.length - 1];
        const id = ins.inscription_id;
        console.log(`Redirect to /inscription/${id}`);
        router.push({ name: 'Inscription', params: { id } });
        return true;
      } else {
        toast.error(`The inscription ${searchText.value} was not found.`)
        return false;
      }
    } else if (searchType === 'inscription_number') {
      if (insStore.inscriptions.length > 0) {
        const ins = insStore.inscriptions[insStore.inscriptions.length - 1];
        const id = ins.inscription_id;
        console.log(`Redirect to /inscription/${id}`);
        router.push({ name: 'Inscription', params: { id } });
        return true;
      } else {
        toast.error(`The inscription #${searchText.value} was not found.`)
        return false;
      }
    } else if (searchType === 'address') {
      console.log(`Redirect to /address/${searchText.value}`);
      router.push({ name: 'Address', params: { address: searchText.value } });
      return true;
    } else if (searchType === 'ticker') {
      console.log(`Redirect to /ticker/${searchText.value}`);
      router.push({ name: 'Ticker', params: { ticker: searchText.value } });
      return true;
    } else {
      toast.error(`Unsupported search condition.`)
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <v-form
    v-bind="props"
    :style="{ width: props.width }"
    @submit.prevent="onSubmit"
  >
    <v-text-field
      v-model="searchText"
      variant="solo-filled"
      hide-details
      prepend-inner-icon="mdi-magnify"
      placeholder="Inscription, Address, Ticker ..."
      color="primary"
    />
  </v-form>
</template>
