import { defineStore } from "pinia";
import config from '@/config'

export const useCustomizerStore = defineStore({
  id: "customizer",
  state: () => ({
    theme: config.theme,
  }),
  getters: {},
  actions: {
    setTheme(payload: any) {
      this.theme = payload;
    },
  },
});
