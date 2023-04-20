import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/pages/HomePage.vue";
import AboutPage from "@/views/pages/AboutPage.vue";
import NewsPage from "@/views/pages/NewsPage.vue";
import AuctionsPage from "@/views/pages/AuctionsPage.vue";
import LoginPage from "@/views/auth/LoginPage.vue";
import AuthService from "@/services/AuthService";

const authService = new AuthService();
const isLogged = authService.isConnected();

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
    },
    {
      path: "/login",
      name: "login",
      component: LoginPage,
    },
  ],
});

router.beforeEach((from, to, next) => {
  const src = "/public/js/active.js";
  var s = document.createElement("script");
  s.setAttribute("src", src);
  document.body.appendChild(s);

  if ((to.name == "login" || !isLogged) && from.name != "login") {
    return next("login");
  }
  return next();
});

export default router;
