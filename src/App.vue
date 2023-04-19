<script setup>
import { RouterView } from "vue-router";
import Preloader from "@/components/theme/Preloader.vue";
import Header from "@/components/theme/Header.vue";
import Footer from "@/components/theme/Footer.vue";
</script>

<template>
  <Preloader />
  <Header />
  <RouterView />
  <Footer />
</template>
