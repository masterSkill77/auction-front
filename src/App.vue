<script setup>
import { RouterView } from "vue-router";
import Preloader from "@/components/theme/Preloader.vue";
import Header from "@/components/theme/Header.vue";
import Footer from "@/components/theme/Footer.vue";
import AuthService from "@/services/AuthService";
import LoginPage from "./views/auth/LoginPage.vue";
</script>

<template>
  <Preloader />
  <Header />
  <Suspense>
    <RouterView />
  </Suspense>
  <Footer />
</template>
