import { defineStore } from 'pinia';
import type { GlobalPopupState } from '@/types/GlobalPopup';

export const useGlobalPopupStore = defineStore({
  id: 'global-popup',
  state: (): GlobalPopupState => ({
    show: false,
    type: 'error',
    icon: 'mdi-alert-box',
    title: '',
    message: '',
  }),
  getters: {},
  actions: {
    close () {
      this.show = false;
    },
    error (title: string, message: string) {
      this.show = true;
      this.type = 'error';
      this.icon = 'mdi-alert-box'
      this.title = title;
      this.message = message;
    },
  }
});
