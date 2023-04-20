<script setup>
import { RouterView } from "vue-router";
import Preloader from "@/components/theme/Preloader.vue";
import Header from "@/components/theme/Header.vue";
import Footer from "@/components/theme/Footer.vue";
import AuthService from "@/services/AuthService";
import LoginPage from "./views/auth/LoginPage.vue";

const authService = new AuthService();

const isLogged = authService.isConnected();
</script>

<template>
  <Preloader />
  <Header />
  <RouterView />
  <Footer />
</template>
