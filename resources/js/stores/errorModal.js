import { defineStore } from 'pinia';

export const useErrorModalStore = defineStore('errorModal', {
  state: () => ({
    isVisible: false,
  }),

  actions: {
    // エラーモーダルを表示
    showError() {
      this.isVisible = true;
    },

    // エラーモーダルを非表示
    hideError() {
      this.isVisible = false;
    },
  },
});
