<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useInscribeStore } from '@/stores/inscribe';
import { toast } from 'vuetify-sonner';

const InsStore = useInscribeStore();

const account = ref('Not connected')
const form = ref({
  tick: 'xxxx',
  totalSupply: 21000000,
  limitPerMint: 1000,
  chain: '309',
  contract: '0xFFFFFFFFFFFFFFFFFFFF',
  toAddress: '',
  feeRate: 1000,
});

const walletForm = ref({
  toAddress: '',
  amount: 1000,
  feeRate: 1,
})

let unisat: any = null
onMounted(async () => {
  if (typeof (window as any).unisat !== 'undefined') {
    unisat = (window as any).unisat
    toast.success('Wallet found!')

    const accounts = await unisat.getAccounts()
    if (accounts.length > 0) {
      account.value = accounts[0]
      form.value.toAddress = accounts[0]
      const balance = await unisat.getBalance()
      console.log('Balance:', balance)
    }

    unisat.on("accountsChanged", (_account: string[]) => {
      account.value = _account[0]
      form.value.toAddress = _account[0]
      console.log('Change account to: ', account.value)
    });

    unisat.on("networkChanged", (_network: string) => {
      console.log('Change network to: ', _network)
    });
  } else {
    toast.error('Wallet not found!')
  }
})

async function onConnect() {
  try {
    let accounts = await unisat.requestAccounts()
    console.log('Unisat return:', accounts)

    account.value = accounts[0]
    form.value.toAddress = accounts[0]
  } catch (err) {
    console.error(err);
    toast.error('Something goes wrong, please inspect the console.')
  }
}

async function onCreate() {
  try {
    let ret = await InsStore.submitForm('c-brc-20', form.value)
    console.log("🚀 | file: WalletDev.vue:71 | onCreate | ret:", ret)
    walletForm.value.toAddress = ret.address
    walletForm.value.amount = ret.value
  } catch (err: any) {
    console.error(err)
    toast.error('Something goes wrong, please inspect the console.')
  }
}

async function onInscribe() {
  console.log(await unisat.getNetwork())
  console.log(await unisat.switchNetwork('testnet'))
  try {
    let txid = await unisat.sendBitcoin(walletForm.value.toAddress, walletForm.value.amount, {
      feeRate: walletForm.value.feeRate,
    });
    console.log(txid)
    toast.success(`Tx id: ${txid}`)
  } catch (err) {
    console.error(err);
    toast.error('Something goes wrong, please inspect the console.')
  }
}
</script>

<template>
  <v-container>
    <v-row class="mt-sm-5">
      <v-col
        cols="12"
        sm="6"
        offset-sm="3"
      >
        <v-card>
          <v-card-title class="py-4 px-6">
            Deploy C-BRC-20
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-label class="font-weight-medium mb-2">
                  Connected Account
                </v-label>
                <v-text-field
                  v-model="account"
                  type="text"
                  hide-details
                  readonly
                />
              </v-col>
              <v-col cols="12">
                <v-btn
                  color="primary"
                  variant="tonal"
                  @click="onConnect"
                >
                  Connect Wallet
                </v-btn>
              </v-col>
              <v-col cols="12">
                <v-label class="font-weight-medium mb-2">
                  Tick
                </v-label>
                <v-text-field
                  v-model="form.tick"
                  type="text"
                  hide-details
                />
              </v-col>
              <v-col cols="12">
                <v-btn
                  color="primary"
                  variant="tonal"
                  @click="onCreate"
                >
                  Create Transaction
                </v-btn>
              </v-col>
              <v-col cols="12">
                <v-label class="font-weight-medium mb-2">
                  Tmp Address
                </v-label>
                <v-text-field
                  v-model.trim="walletForm.toAddress"
                  type="text"
                  hide-details
                />
              </v-col>
              <v-col cols="12">
                <v-label class="font-weight-medium mb-2">
                  To Tmp Address Amount
                </v-label>
                <v-text-field
                  v-model.number="walletForm.amount"
                  type="number"
                  hide-details
                />
              </v-col>
              <v-col cols="12">
                <v-label class="font-weight-medium mb-2">
                  Fee Rate
                </v-label>
                <v-text-field
                  v-model.number="walletForm.feeRate"
                  type="number"
                  hide-details
                />
              </v-col>
              <v-col cols="12">
                <v-btn
                  color="primary"
                  variant="tonal"
                  @click="onInscribe"
                >
                  Inscribe
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.v-container {
  max-width: 1200px !important;
}

</style>
