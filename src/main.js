import "https://cdn.jsdelivr.net/npm/survey-core@1.9.113/defaultV2.min.css";
import "/public/css/survey.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import VueCountdown from "@chenfengyuan/vue-countdown";
import i18n from "./i18n";

import "hover.css";

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

import Notifications from "@kyvg/vue3-notification";

const app = createApp(App);

app.use(createPinia());
// const pinia = createPinia();
// app.use(pinia);
app.use(router);
app.use(i18n);
app.use(Notifications);
app.component(VueCountdown.name, VueCountdown);

app.mount("#app");
