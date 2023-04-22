import { createApp } from "vue";
import { createPinia } from "pinia";
import VueCountdown from "@chenfengyuan/vue-countdown";

import App from "./App.vue";
import router from "./router";

import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: "pusher",
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: true,
});

// import './assets/main.css'

import { createI18n } from "vue-i18n";

import { languages } from "./i18n/index.js";
import { defaultLocale } from "./i18n/index.js";
const messages = Object.assign(languages);

const i18n = createI18n({
  locale: defaultLocale,
  fallbackLocale: "fr",
  messages,
});

const app = createApp(App);

app.use(createPinia());
// const pinia = createPinia();
// app.use(pinia);
app.use(router);
app.use(i18n);
app.component(VueCountdown.name, VueCountdown);

app.mount("#app");
