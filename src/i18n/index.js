import { createI18n } from "vue-i18n";
import messages from "@intlify/unplugin-vue-i18n/messages";

export const defaultLocale = "fr";

export default createI18n({
  locale: import.meta.env.VITE_DEFAULT_LOCALE, // <--- 1
  fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE, // <--- 2
  legacy: false, // <--- 3
  availableLocales: ["en", "fr"],
  globalInjection: true,
  messages: messages,
});
