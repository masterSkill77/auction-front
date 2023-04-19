import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/pages/HomePage.vue";
import AboutPage from "@/views/pages/AboutPage.vue";

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
  ],
});

export default router;
