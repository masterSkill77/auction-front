<template>
  <div class="menu-block customscroll">
    <div class="sidebar-menu">
      <ul id="accordion-menu">
        <li class="dropdown">
          <router-link to="/profile" class="dropdown-toggle">
            <span class="micon dw dw-house-1"></span
            ><span class="mtext">{{ $t("menu.home") }}</span>
          </router-link>
        </li>
        <li class="dropdown">
          <router-link to="/profile/nfts" class="dropdown-toggle">
            <span class="micon dw dw-folder-2"></span
            ><span class="mtext">{{ $t("menu.mynft") }}</span>
          </router-link>
        </li>
        <li class="dropdown">
          <router-link to="/profile/auctions" class="dropdown-toggle">
            <span class="micon dw dw-shopping-basket-1"></span
            ><span class="mtext">{{ $t("menu.myauctions") }}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/profile/chat" class="dropdown-toggle no-arrow">
            <span class="micon dw dw-chat3"></span
            ><span class="mtext">Chat</span>
          </router-link>
        </li>
        <li>
          <router-link to="/profile/settings" class="dropdown-toggle no-arrow">
            <span class="micon dw dw-settings"></span
            ><span class="mtext">{{ $t("menu.settings") }}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/profile/create" class="dropdown-toggle no-arrow">
            <span class="micon dw dw-diagram"></span
            ><span class="mtext">{{ $t("menu.create") }}</span>
          </router-link>
        </li>
        <li>
          <a href="" @click.prevent="logout" class="dropdown-toggle no-arrow">
            <span class="micon dw dw-logout-1"></span
            ><span class="mtext">{{ $t("menu.logout") }}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { useAuthStore } from "../../../../stores/auth";
import { useRouter } from "vue-router";
const router = useRouter();

const logout = () => {
  useAuthStore().logout();
  router.push("/login");
};
</script>
