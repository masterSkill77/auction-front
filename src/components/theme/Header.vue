<template>
  <header class="header-area">
    <!-- Top Header Area -->
    <div class="top-header">
      <div class="container-fluid h-100">
        <div class="row h-100">
          <div class="col-12 h-100">
            <div
              class="top-header-content h-100 d-flex align-items-center justify-content-between"
            >
              <!-- Top Headline -->
              <div class="top-headline">
                <p>Welcome to <span>Cryptos</span></p>
              </div>
              <!-- Top Login & Faq & Earn Monery btn -->
              <div class="login-faq-earn-money">
                <router-link to="/login" v-if="!isLogged">Login</router-link>
                <a href="/logout" @click.prevent="logout()" v-else>Logout</a>
                <a href="#">FAQ</a>
                <router-link v-if="isLogged" to="/profile"
                  >Dashboard ({{ me.email }})</router-link
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Navbar Area -->
    <Menu v-if="!$route.path.includes('profile')" />
  </header>
</template>
<script setup>
import { useAuthStore } from "@/stores/auth";
import Menu from "@/components/UI/menu/Menu.vue";
import { storeToRefs } from "pinia";
import router from "@/router/index";

const { isAuthenticated, me } = storeToRefs(useAuthStore());
const isLogged = isAuthenticated;

const logout = () => {
  useAuthStore().logout();
  router.push("/login");
};
</script>
