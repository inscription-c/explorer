import { defineStore } from 'pinia';
import client from '@/utils/explorer-client';
import type { StatisticsState } from '@/types/Statistics';

export const useStatisticsStore = defineStore({
  id: 'statictics',
  state: (): StatisticsState => ({
    inscriptions: 0,
    stored_data: 0,
    total_fees: 0,
  }),
  getters: {},
  actions: {
    async fetchStatistics () {
      try {
        const data = await client.get('/home/page/statistics');

        const respData = data.data;
        this.inscriptions = respData.inscriptions;
        this.stored_data = respData.stored_data;
        this.total_fees = respData.total_fees;
      } catch (error: any) {
        console.error(error);
      }
    },
  }
});
