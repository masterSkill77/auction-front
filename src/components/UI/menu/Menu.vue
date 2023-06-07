<template>
  <div class="cryptos-main-menu">
    <div
      :class="`classy-nav-container light left ${
        'breakpoint-' + (breakpoint ? 'on' : 'off')
      }`"
    >
      <div class="container">
        <!-- Menu -->
        <nav class="classy-navbar justify-content-between" id="cryptosNav">
          <!-- Logo -->
          <a class="nav-brand" href="/"
            ><img src="/img/core-img/logo.png" alt=""
          /></a>

          <!-- Navbar Toggler -->
          <div class="classy-navbar-toggler">
            <span
              :class="{ navbarToggler: true, active: menuOn }"
              @click="menuOn = !menuOn"
              ><span></span><span></span><span></span
            ></span>
          </div>

          <!-- Menu -->
          <div :class="{ 'classy-menu': true, 'menu-on': menuOn == true }">
            <!-- close btn -->
            <div class="classycloseIcon" @click="menuOn = false">
              <div class="cross-wrap">
                <span class="top"></span><span class="bottom"></span>
              </div>
            </div>
            <div class="classynav">
              <ul>
                <li>
                  <router-link to="/">{{ $t("menu.home") }}</router-link>
                </li>

                <li>
                  <router-link to="/auctions">{{
                    $t("menu.auctions")
                  }}</router-link>
                </li>
                <li>
                  <router-link to="/about">{{ $t("menu.about") }}</router-link>
                </li>
                <li>
                  <router-link to="/news">{{ $t("menu.news") }}</router-link>
                </li>
                <li>
                  <router-link to="/contact">{{
                    $t("menu.contact")
                  }}</router-link>
                </li>
              </ul>

              <!-- Newsletter Form -->
              <div class="header-newsletter-form">
                <form action="#" method="post">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Newsletter"
                  />
                  <button type="submit">Subscribe</button>
                </form>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

let breakpoint = ref(false);
const menuOn = ref(false);
if (window.innerWidth < 992) breakpoint.value = true;

window.addEventListener("resize", () => {
  breakpoint.value = window.innerWidth > 992 ? false : true;
});
</script>
