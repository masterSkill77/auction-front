import { defineStore } from "pinia";

export const useI18nStore = defineStore("i18n", {
  state: () => ({
    currentLanguage:
      localStorage.getItem("auction-local") ??
      import.meta.env.VITE_DEFAULT_LOCALE,
  }),
  actions: {
    changeLanguage(locale) {
      this.currentLanguage = locale;
    },
  },
  getters: {
    currentLocale() {
      return this.currentLanguage;
    },
  },
});
