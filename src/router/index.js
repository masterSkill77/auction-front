import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/pages/HomePage.vue";
import AboutPage from "@/views/pages/AboutPage.vue";
import NewsPage from "@/views/pages/NewsPage.vue";
import AuctionsPage from "@/views/pages/AuctionsPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
      beforeEnter: () => {
        const src = "/public/js/active.js";
        var s = document.createElement("script");
        s.setAttribute("src", src);
        document.body.appendChild(s);
      },
    },
    {
      path: "/about",
      name: "about",
      component: AboutPage,
    },
    {
      path: "/news",
      name: "news",
      component: NewsPage,
    },
    {
      path: "/auctions",
      name: "auctions",
      component: AuctionsPage,
    },
  ],
});

export default router;
