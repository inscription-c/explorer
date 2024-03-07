<script setup lang="ts">
import { defineProps, defineModel } from 'vue'

defineProps<{
  msg?: string
}>()

const show = defineModel<boolean>()
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <v-dialog
    :value="show"
    max-width="700"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-list
      class="py-2"
      color="primary"
      elevation="12"
      rounded="lg"
    >
      <v-list-item
        :title="$props.msg"
      >
        <template #prepend>
          <div class="pe-4">
            <v-icon
              color="primary"
              size="x-large"
              icon="mdi-wallet"
            />
          </div>
        </template>

        <template #append>
          <v-progress-circular
            color="primary"
            indeterminate="disable-shrink"
            size="16"
            width="2"
          />
        </template>
      </v-list-item>
    </v-list>
  </v-dialog>
</template>
