<template>
  <div class="menu-block customscroll">
    <div class="sidebar-menu">
      <ul id="accordion-menu">
        <li class="dropdown">
          <router-link to="/" class="dropdown-toggle">
            <span class="micon dw dw-house-1"></span
            ><span class="mtext">Home</span>
          </router-link>
        </li>
        <li class="dropdown">
          <router-link to="/profile/nfts" class="dropdown-toggle">
            <span class="micon dw dw-folder-2"></span
            ><span class="mtext">My NFTs</span>
          </router-link>
        </li>
        <li class="dropdown">
          <router-link to="/profile/auctions" class="dropdown-toggle">
            <span class="micon dw dw-shopping-basket-1"></span
            ><span class="mtext">My Auctions</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup></script>
