import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import HomePage from "@/views/pages/HomePage.vue";
import AboutPage from "@/views/pages/AboutPage.vue";
import NewsPage from "@/views/pages/NewsPage.vue";
import AuctionsPage from "@/views/pages/AuctionsPage.vue";
import AdminPage from "@/views/pages/AdminPage.vue";
import ChatPage from "@/views/pages/ChatPage.vue";
import AuctionPage from "@/Model/auctions/AuctionCard.vue";
import LoginPage from "@/views/auth/LoginPage.vue";
import NotFound from "@/views/404.vue";
import AdminHomePage from "@/components/UI/dashboard/AdminHomePage.vue";
import SettingsPage from "@/views/pages/SettingsPage.vue";
import PaiementPage from "@/views/pages/PaiementPage.vue";
import MyAuctionsPage from "@/views/pages/MyAuctionsPage.vue";

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
      name: "cardauction",
      path: "/auction/:auctionId",
      component: AuctionPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/profile",
      name: "Profile",
      component: AdminPage,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: "chat",
          name: "Chat",
          component: ChatPage,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "",
          name: "HomeAdminPage",
          component: AdminHomePage,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "settings",
          name: "Settings",
          component: SettingsPage,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "paiement",
          name: "Paiement",
          component: PaiementPage,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "auctions",
          name: "My Auctions",
          component: MyAuctionsPage,
          meta: {
            requiresAuth: true,
          },
        },
      ],
    },

    {
      path: "/login",
      name: "login",
      component: LoginPage,
    },
    { path: "/:catchAll(.*)", name: "NotFound", component: NotFound },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const src = "/js/active.js";
  var s = document.createElement("script");
  s.setAttribute("src", src);
  document.body.appendChild(s);
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated && from.name !== "login") {
      next({ name: "login" });
      return;
    } else {
      next();
      return;
    }
  } else {
    next();
    return;
  }
});

export default router;
