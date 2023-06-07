<template>
  <header class="header-area" v-if="!$route.path.includes('profile')">
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
                <router-link to="/register" v-if="!isLogged">{{
                  $t("menu.register")
                }}</router-link>
                <router-link to="/login" v-if="!isLogged">{{
                  $t("menu.login")
                }}</router-link>
                <a href="/logout" @click.prevent="logout()" v-else>{{
                  $t("menu.logout")
                }}</a>
                <a href="#">FAQ</a>
                <router-link v-if="isLogged" to="/profile"
                  >Dashboard ({{ me.email }})</router-link
                >
                <select
                  v-model="$i18n.locale"
                  @change="changeLange($i18n.locale)"
                  id="locale"
                >
                  <option
                    v-for="locale in $i18n.availableLocales"
                    :value="locale"
                    :key="locale.id"
                  >
                    {{ locale }}
                  </option>
                </select>
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
import { useI18nStore } from "../../stores/i18n";

const { isAuthenticated, me } = storeToRefs(useAuthStore());
const isLogged = isAuthenticated;

const logout = () => {
  useAuthStore().logout();
  router.push("/login");
};

const changeLange = (langue) => {
  localStorage.setItem("auction-local", langue);
  useI18nStore().changeLanguage(langue);
};
</script>
