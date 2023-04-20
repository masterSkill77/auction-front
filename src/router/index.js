import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import HomePage from "@/views/pages/HomePage.vue";
import AboutPage from "@/views/pages/AboutPage.vue";
import NewsPage from "@/views/pages/NewsPage.vue";
import AuctionsPage from "@/views/pages/AuctionsPage.vue";
import LoginPage from "@/views/auth/LoginPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
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
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/login",
      name: "login",
      component: LoginPage,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const src = "/public/js/active.js";
  var s = document.createElement("script");
  s.setAttribute("src", src);
  document.body.appendChild(s);
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      next({ name: "Login" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
