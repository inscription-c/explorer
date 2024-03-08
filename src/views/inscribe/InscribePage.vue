<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useDisplay } from 'vuetify';
import { useInscribeStore } from '@/stores/inscribe';
import { toast } from 'vuetify-sonner';
import { toSatsPerByte, toSatsPerKB } from '@/utils/helpers';
import config from '@/config';

import walletOkxIcon from '@/assets/images/wallet-okx.svg'
import walletUnisatIcon from '@/assets/images/wallet-unisat.svg'

import RisingWarningDialog from './RiskingWarningDialog.vue'
import WaitingDialog from './WaitingDialog.vue'

const InsStore = useInscribeStore();

const step = ref(1);
const { xs } = useDisplay()

// Step 1
const chains = ref<{ name: string, coinType: string }[]>([]);
const basicFormEl = ref()
const basicFormStatus = ref(false)
const basicForm = ref({
  tick: '',
  totalSupply: 21000000,
  limitPerMint: 1000,
  chain: '',
  contract: '',
  toAddress: '',
  feeRate: 1000, // sats/vKB
});
const basicFormRules = {
  required: (v: string) => !!v || 'The field is required.',
  int: (v: number) => Number.isInteger(v) || 'The field must be an integer.',
  tick: (v: string) => {
    // The token name has 32 chars limit and can be duplicated. Characters should be limited to 0-9a-z and -.
    const reg = /^[0-9a-z-]{1,32}$/;
    return reg.test(v) || 'The token name should be 1-32 characters long and only contain `0-9a-z` and `-`.';
  },
}

// Step 2
const recommendedFeeRates = ref([
    { index: 0, value: 1, name: 'Slow 1 sats/vB' },
    { index: 1, value: 2, name: 'Normal 2 sats/vB' },
    { index: 2, value: 3, name: 'Fast 3 sats/vB' },
]);
const selectedFeeRate = ref(1)
const warningShow = ref(false)
const rawInscription = computed(() => {
  return JSON.stringify({
    p: 'c-brc-20',
    op: 'deploy',
    tick: basicForm.value.tick,
    max: basicForm.value.totalSupply,
    lim: basicForm.value.limitPerMint,
  })
})
const confirmWarning = ref(false)

// Step 3
const wallets = ref([
  { value: 'unisat', name: 'UniSat', icon: walletUnisatIcon },
  { value: 'okx', name: 'OKX', icon: walletOkxIcon },
])
let wallet: any = null;
const account = ref('Not connected')
const network = ref('')
const waitingShow = ref(false)
const waitingMsg = ref('Connecting wallet ...')
const orders = computed(() => {
  return InsStore.orders.map((order) => {
    let title, color, closable
    let icon = ''
    let txId = ''
    switch (order.status) {
      case 'pending':
        title = 'Pending inscription'
        color = 'info'
        closable = false
        break;
      case 'success':
        title = 'Inscribing succeed'
        color = 'success'
        icon = 'mdi-check-circle'
        closable = true
        txId = order.insId.slice(0, order.insId.length - 2)
        break;
      case 'failed':
        title = 'Inscribing failed'
        color = 'error'
        icon = 'mdi-alert-circle'
        closable = true
        break;
    }

    return {
      id: order.id,
      insId: order.insId,
      txId,
      title,
      color,
      icon,
      closable,
      content: order.content,
    }
  })
})

let timer: any;
async function pullOrdersStatus() {
  console.log('Pulling orders\' status ...')

  await InsStore.fetchOrdersStatus()
  timer = setTimeout(pullOrdersStatus, 10000)
}

onMounted(async () => {
  InsStore.getOrders()
  pullOrdersStatus()

  const ret = await InsStore.fetchChains();
  if (ret) {
    chains.value = ret.map((chain) => {
      return {
        name: chain.chain_name,
        coinType: chain.coin_type,
      }
    });
  }

  onIntoStep(step.value)
});

onUnmounted(async () => {
  clearTimeout(timer)
});

function onCloseOrder(index: number) {
  InsStore.removeOrder(index)
}

function onBack() {
  if (step.value > 1) {
    step.value--;
  }

  onIntoStep(step.value)
}

function onNext() {
  switch (step.value) {
    case 1:
      basicFormEl.value.validate()
      console.log("Form validation result:", basicFormStatus.value)
      if (basicFormStatus.value) {
        step.value++;
      }
      break;
    case 2:
      console.log('Risk warning confirm result:', confirmWarning.value)
      if (confirmWarning.value) {
        step.value++;
      }
      break;
  }

  onIntoStep(step.value)
}

async function onIntoStep(step: number) {
  console.log('Change step to:', step)

  switch (step) {
    case 2:
      const feeRates = await InsStore.fetchRecommendedFeeRate();
      if (feeRates) {
        recommendedFeeRates.value = [
          { index: 0, value: toSatsPerByte(feeRates.slow), name: `Slow ${toSatsPerByte(feeRates.slow)} sats/vB` },
          { index: 1, value: toSatsPerByte(feeRates.normal), name: `Normal ${toSatsPerByte(feeRates.normal)} sats/vB` },
          { index: 2, value: toSatsPerByte(feeRates.fast), name: `Fast ${toSatsPerByte(feeRates.fast)} sats/vB` },
        ];
      }
      break;
    case 4:
      break;
  }
}

function onSelectFeeRate (option: any) {
  let result;
  if (xs.value) {
    result = recommendedFeeRates.value[option.id]
  } else {
    result = recommendedFeeRates.value[selectedFeeRate.value]
  }
  basicForm.value.feeRate = toSatsPerKB(result.value)
}

async function onSelectWallet(e: any) {
  console.log('Select wallet:', e.id)

  switch (e.id.value) {
    case 'unisat':
      if ((window as any).unisat) {
        wallet = (window as any).unisat
      } else {
        toast.error('UniSat wallet is not found')
      }
      break;
    case 'okx':
      if ((window as any).okxwallet) {
        wallet = (window as any).okxwallet.bitcoin
      } else {
        toast.error('OKX wallet is not found')
      }
      break;
  }

  if (wallet) {
    waitingShow.value = true

    await connectWallet();
    try {
      const { orderId, address, amount } = await buildTransaction();
      try {
        await sendTransaction(address, amount);
        InsStore.pushOrder({
          id: orderId,
          insId: '',
          status: 'pending',
          content: rawInscription.value,
          failedReason: '',
        })
        step.value = 4
      } catch (err: any) {
        console.error('Signing transaction failed:', err)
        toast.error(`Signing transaction failed: ${err.message}`)
      }
    } catch (err: any) {
      console.error('Building transaction failed:', err)
      toast.error(`Building transaction failed: ${err}`)
    }

    waitingShow.value = false
  }
}

async function connectWallet() {
  try {
    waitingMsg.value = 'Connecting wallet ...'

    account.value = await wallet.requestAccounts()
    network.value = await wallet.getNetwork()
  } catch (err) {
    console.error('Wallet error:', err)
    toast.error('Connect the wallet failed.')
  }
}

async function buildTransaction(): Promise<{ orderId: string, address: string, amount: number }> {
  waitingMsg.value = 'Building transaction ...'

  const order = await InsStore.submitForm('c-brc-20', basicForm.value)
  return {
    orderId: order.order_id,
    address: order.address,
    amount: order.value,
  }
}

async function sendTransaction(address: string, amount: number): Promise<string> {
  waitingMsg.value = 'Sending transaction ...'

  return wallet.sendBitcoin(address, amount, {
    feeRate: toSatsPerByte(basicForm.value.feeRate),
  });
}

function onInscribeAnother() {
  basicForm.value.tick = ''
  basicForm.value.contract = ''
  confirmWarning.value = false

  step.value = 1
}
</script>

<template>
  <v-container>
    <v-row class="mt-sm-5">
      <v-col
        cols="12"
      >
        <v-alert
          v-for="(order, index) in orders"
          :key="order.id"
          :color="order.color"
          :title="order.title"
          class="mb-6"
        >
          <template #prepend>
            <v-icon
              v-if="order.color !== 'info'"
              :icon="order.icon"
            />
            <v-progress-circular
              v-else
              indeterminate="disable-shrink"
              size="22"
              width="2"
            />
          </template>

          <div class="raw-code-no-bg rounded">
            {{ order.content }}
          </div>
          <!-- inscribing succeed -->
          <div
            v-if="order.color === 'success'"
            class="my-2 d-flex justify-end"
          >
            <v-btn
              color="success"
              class="mr-2"
              @click="onCloseOrder(index)"
            >
              Close
            </v-btn>
            <router-link
              class="mr-2"
              :to="`/inscription/${order.insId}`"
            >
              <v-btn color="primary">
                Inscription
              </v-btn>
            </router-link>
            <a
              :href="`${config.mempoolUrl}tx/${order.txId}`"
              target="blank"
            >
              <v-btn color="primary">Mempool</v-btn>
            </a>
          </div>
          <!-- inscribing failed -->
          <div
            v-if="order.color === 'error'"
            class="my-2 d-flex justify-end"
          >
            <v-btn
              color="success"
              class="mr-2"
              @click="onCloseOrder(index)"
            >
              Close
            </v-btn>
          </div>
        </v-alert>
      </v-col>
    </v-row>
    <v-row class="mt-sm-5">
      <v-col
        cols="12"
        sm="8"
        offset-sm="2"
        md="6"
        offset-md="3"
      >
        <v-card>
          <v-card-title class="py-4 px-6">
            Deploy C-BRC-20
          </v-card-title>

          <v-stepper
            v-model="step"
            elevation="0"
          >
            <v-stepper-header elevation="0">
              <v-stepper-item
                :value="1"
                :editable="step > 1 && step < 4"
                :complete="step > 1"
              />
              <v-divider />
              <v-stepper-item
                :value="2"
                :editable="step > 2 && step < 4"
                :complete="step > 2"
              />
              <v-divider />
              <v-stepper-item :value="3" />
              <v-divider />
              <v-stepper-item :value="4" />
            </v-stepper-header>

            <v-stepper-window>
              <!-- Step 1 -->
              <v-stepper-window-item :value="1">
                <v-card-text>
                  <v-form
                    ref="basicFormEl"
                    v-model="basicFormStatus"
                  >
                    <v-row>
                      <v-col cols="12">
                        <v-label class="font-weight-medium mb-2">
                          Tick
                        </v-label>
                        <v-text-field
                          v-model="basicForm.tick"
                          type="text"
                          placeholder="The name of inscription"
                          :rules="[basicFormRules.required, basicFormRules.tick]"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-label class="font-weight-medium mb-2">
                          Total Supply
                        </v-label>
                        <v-text-field
                          v-model.number="basicForm.totalSupply"
                          type="number"
                          min="1"
                          :rules="[basicFormRules.required, basicFormRules.int]"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-label class="font-weight-medium mb-2">
                          Limit Per Mint
                        </v-label>
                        <v-text-field
                          v-model.number="basicForm.limitPerMint"
                          type="number"
                          mint="1"
                          :rules="[basicFormRules.required, basicFormRules.int]"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-label class="font-weight-medium mb-2">
                          L2 Network
                        </v-label>
                        <v-autocomplete
                          v-model="basicForm.chain"
                          color="primary"
                          variant="outlined"
                          eager
                          :rules="[basicFormRules.required]"
                          :items="chains"
                          item-title="name"
                          item-value="coinType"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-label class="font-weight-medium mb-2">
                          Contract
                        </v-label>
                        <v-text-field
                          v-model.trim="basicForm.contract"
                          type="text"
                          :rules="[basicFormRules.required]"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-label class="font-weight-medium mb-2">
                          To Address
                        </v-label>
                        <v-text-field
                          v-model.trim="basicForm.toAddress"
                          type="text"
                          :rules="[basicFormRules.required]"
                        />
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
              </v-stepper-window-item>

              <!-- Step 2 -->
              <v-stepper-window-item :value="2">
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <div class="raw-code pa-4 rounded">
                        {{ rawInscription }}
                      </div>
                    </v-col>
                    <v-col
                      class="d-flex justify-center"
                      cols="12"
                    >
                      <v-list
                        v-if="xs"
                        rounded
                        bg-color="primary"
                        :selected="[selectedFeeRate]"
                        :items="recommendedFeeRates"
                        item-value="index"
                        item-title="name"
                        @click:select="onSelectFeeRate"
                      />
                      <v-btn-toggle
                        v-else
                        v-model="selectedFeeRate"
                        class="fee-rates-btns"
                        color="primary"
                        divided
                        @update:model-value="onSelectFeeRate"
                      >
                        <v-btn
                          v-for="item in recommendedFeeRates"
                          :key="item.index"
                        >
                          {{ item.name }}
                        </v-btn>
                      </v-btn-toggle>
                    </v-col>
                    <v-col cols="12">
                      <v-checkbox
                        v-model="confirmWarning"
                        class="d-flex justify-center"
                      >
                        <template #label>
                          <div>
                            I have read and agreed to the
                            <a
                              class="text-primary"
                              href="#"
                              @click.prevent="warningShow = true"
                            >
                              risk warning
                            </a>
                          </div>
                        </template>
                      </v-checkbox>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-stepper-window-item>

              <!-- Step 3 -->
              <v-stepper-window-item :value="3">
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <h2 class="mb-2">
                        Deploy
                      </h2>
                      <div class="raw-code pa-4 rounded">
                        {{ rawInscription }}
                      </div>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12">
                      <h2 class="mb-2">
                        To
                      </h2>
                      <div class="raw-code pa-4 rounded">
                        {{ basicForm.toAddress }}
                      </div>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12">
                      <h2 class="mb-2">
                        Select Wallet
                      </h2>
                      <v-list
                        class="wallet-list rounded"
                        @click:select="onSelectWallet"
                      >
                        <v-list-item
                          v-for="item in wallets"
                          :key="item.value"
                          :value="item"
                          color="primary"
                        >
                          <template #prepend>
                            <v-avatar rounded="sm">
                              <img
                                class="w-100 h-100"
                                :src="item.icon"
                                alt="wallet-icon"
                              >
                            </v-avatar>
                          </template>

                          <v-list-item-title v-text="item.name" />
                        </v-list-item>
                      </v-list>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-stepper-window-item>

              <!-- Step 4 -->
              <v-stepper-window-item :value="4">
                <v-card-text>
                  <v-row>
                    <v-col
                      cols="12"
                      class="d-flex flex-column justify-center align-center"
                    >
                      <v-icon
                        class="end-icon text-success"
                        icon="mdi-check"
                      />
                      <h2 class="pb-6 text-center">
                        Transaction have been pushed successfully!
                      </h2>
                      <v-btn
                        color="primary"
                        variant="tonal"
                        size="large"
                        @click="onInscribeAnother"
                      >
                        Inscribe Another
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-stepper-window-item>
            </v-stepper-window>

            <v-stepper-actions color="primary">
              <template #prev>
                <v-btn
                  v-if="step > 1 && step < 4"
                  variant="tonal"
                  @click="onBack"
                >
                  Prev
                </v-btn>
                <v-spacer v-else />
              </template>
              <template #next>
                <v-btn
                  v-if="step < 3"
                  @click="onNext"
                >
                  Next
                </v-btn>
              </template>
            </v-stepper-actions>
          </v-stepper>
        </v-card>
      </v-col>
    </v-row>

    <WaitingDialog
      v-model="waitingShow"
      :msg="waitingMsg"
    />
    <RisingWarningDialog v-model="warningShow" />
  </v-container>
</template>

<style lang="scss" scoped>
.v-container {
  max-width: 1200px !important;
}

.v-stepper-header {
  box-shadow: none;
}

.v-stepper-window {
  margin: 0;
}

.raw-code {
  background-color: rgb(var(--v-theme-lightprimary));
  font-family: monospace;
  font-size: 1.1rem;
  overflow: hidden;
  overflow-wrap: break-word;
  word-break: break-all;
}

.raw-code-no-bg {
  font-family: monospace;
  font-size: 1.1rem;
  overflow: hidden;
  overflow-wrap: break-word;
  word-break: break-all;
}

.fee-rates-btns {
  .v-btn {
    text-transform: none;
  }
}

.wallet-list {
  background-color: rgb(var(--v-theme-lightprimary));
  border: 1px solid rgba(var(--v-border-color), 1);

  .v-list-item {
    border-bottom: 1px solid rgba(var(--v-border-color), 1);
  }

  .v-list-item:last-child {
    border-bottom: none;
  }
}

.end-icon {
  font-size: 10rem;
}
</style>
