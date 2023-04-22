<template>
  <HeaderDashboard />
  <div class="left-side-bar">
    <div class="brand-logo">
      <router-link to="/">
        <img src="/img/core-img/logo.png" alt="" />
      </router-link>
      <div class="close-sidebar" data-toggle="left-sidebar-close">
        <i class="ion-close-round"></i>
      </div>
    </div>
    <Menu />
  </div>
  <div class="mobile-menu-overlay"></div>

  <div class="main-container">
    <router-view class="container-fluid" :key="$route.path" />
  </div>
</template>
<script setup>
import HeaderDashboard from "../../components/UI/dashboard/HeaderDashboard.vue";
import Menu from "../../components/UI/dashboard/menu/Menu.vue";
</script>
