<script setup lang="ts">
import { defineModel } from 'vue'

const show = defineModel<boolean>()
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <v-dialog
    :value="show"
    width="auto"
    max-width="700"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="pa-6 pb-0 d-flex justify-space-between align-center">
        <h3>Risk Warning</h3>

        <v-btn
          icon="mdi-close"
          variant="text"
          @click="emit('update:modelValue', false)"
        />
      </v-card-title>

      <v-card-text class="pa-6 pt-0">
        <ol class="pl-6">
          <li>In case of platform order congestion, there might be delays in on-chain processing, and we cannot guarantee the on-chain processing time.</li>
          <li>The rate you submit now does not represent the real-time on-chain rate. Please be aware of the fluctuating on-chain rate.</li>
          <li>If there are unconfirmed outbound transactions in your payment account, please stop the payment or switch to another account for operation.</li>
          <li>When encountering orders with ongoing engraving, please patiently wait for the miner's confirmation, as the transaction cannot be revoked.</li>
          <li>Please carefully evaluate and ensure that you fully understand these risks, and are willing to bear all consequences arising from them.</li>
        </ol>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
