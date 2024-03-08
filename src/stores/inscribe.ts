import { defineStore } from 'pinia';
import client from '@/utils/explorer-client';
import type { CBrc20, InscribeForm, ContentProtocol, Order } from '@/types/Inscribe';
import { toast } from 'vuetify-sonner';

const cacheTime = 300

type RpcChain = {
  chain_name: string,
  coin_type: string,
}

type RpcRecomendedFeeRate = {
  slow: number,
  normal: number,
  fast: number,
}

function readLocalStorage() {
  let pendingOrders = localStorage.getItem('pending-orders')
  let orders
  if (pendingOrders) {
    orders = JSON.parse(pendingOrders)
    if (!Array.isArray(orders)) {
      orders = []
    }
  } else {
    orders = []
  }

  return orders
}

function writeLocalStorage(orders: Order[]) {
  localStorage.setItem('pending-orders', JSON.stringify(orders))
}

export const useInscribeStore = defineStore({
  id: 'inscribe',
  state: (): InscribeForm => ({
    loading: false,
    type: 'c-brc-20',
    form: null,
    orders: [],
  }),
  actions: {
    async fetchChains(ignoreCache = false): Promise<RpcChain[] | null> {
      this.loading = true;

      if (ignoreCache) {
        localStorage.removeItem('chains')
      }

      const chainsData = localStorage.getItem('chains')
      let now = new Date().getTime();
      if (chainsData) {
        let chainsDataJson = JSON.parse(chainsData)
        if (now - chainsDataJson.createdAt < cacheTime * 1000 && chainsDataJson.list.length === 0) {
          this.loading = false
          return chainsDataJson.list
        }
      }

      try {
        const data = await client.get('/l2/networks');

        this.loading = false;
        const respData = data.data;

        localStorage.setItem('chains', JSON.stringify({ list: respData, createdAt: now }))

        return respData
      } catch (error: any) {
        this.loading = false;
        console.error(error)
        toast.error('Failed to fetch chains\' information.')
        return null
      }
    },
    async fetchRecommendedFeeRate(): Promise<RpcRecomendedFeeRate | null> {
      this.loading = true;

      try {
        const data = await client.get('/estimate-smart-fee');

        this.loading = false;
        const respData = data.data;

        return respData
      } catch (error: any) {
        this.loading = false;
        console.error(error)
        toast.error('Failed to fetch recommended fee rate.')
        return null
      }
    },
    setForm(type: ContentProtocol, form: CBrc20) {
      this.type = type
      this.form = form
    },
    async submitForm (type: ContentProtocol, form: CBrc20) {
      // console.log(this.loading)
      if (this.loading) return false;
      this.loading = true;

      this.type = type
      this.form = form

      let params: any
      switch (this.type) {
        case 'c-brc-20':
          params = {
            postage: 330,
            ticker: this.form.tick,
            total_supply: this.form.totalSupply.toString(),
            limit_per_mint: this.form.limitPerMint.toString(),
            l2_network: this.form.chain,
            contract: this.form.contract,
            receive_address: this.form.toAddress,
            fee_rate: this.form.feeRate,
          }
          break;
      }

      // console.log('Submit inscription form')

      try {
        const data = await client.post('/inscribe/order/create/c-brc20-deploy', params);

        this.loading = false;
        const respData = data.data;
        return respData
      } catch (error) {
        this.loading = false;

        console.error(error);
        return null
      }
    },
    getOrders() {
      let orders = readLocalStorage()
      this.orders = orders
    },
    pushOrder(order: Order) {
      let orders = readLocalStorage()
      orders.push(order)
      writeLocalStorage(orders)

      this.orders = orders
    },
    removeOrder(index: number) {
      let orders = readLocalStorage()
      orders.splice(index, 1)
      writeLocalStorage(orders)

      this.orders = orders
    },
    async fetchOrdersStatus() {
      await Promise.all(this.orders
        .filter((order) => order.status === 'pending')
        .map(async (order) => {
          try {
            const data = await client.get(`/order/status/${order.id}`);
            const respData = data.data;

            if (respData.status === 2) {
              order.status = 'success'
              order.insId = respData.inscription_id
            } else if (respData.status === -1 || respData.status === -2) {
              order.status = 'failed'
            }
          } catch (error) {
            console.error(error);
          }
        }))

      writeLocalStorage(this.orders)
    }
  }
});
