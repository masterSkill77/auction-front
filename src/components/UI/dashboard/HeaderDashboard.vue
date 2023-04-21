<template>
  <div class="header">
    <div class="header-left">
      <div class="menu-icon dw dw-menu"></div>
      <div
        class="search-toggle-icon dw dw-search2"
        data-toggle="header_search"
      ></div>
      <div class="header-search">
        <form>
          <div class="form-group mb-0">
            <i class="dw dw-search2 search-icon"></i>
            <input
              type="text"
              class="form-control search-input"
              placeholder="Search Here"
            />
          </div>
        </form>
      </div>
    </div>
    <div class="header-right">
      <div class="dashboard-setting user-notification">
        <div class="dropdown">
          <a
            @click="showSettings"
            class="dropdown-toggle no-arrow"
            href="#"
            data-toggle="right-sidebar"
          >
            <i class="dw dw-settings2"></i>
          </a>
        </div>
      </div>
      <div class="user-info-dropdown">
        <div class="dropdown">
          <a class="dropdown-toggle" href="#">
            <span class="user-icon"> </span>
            <span class="user-name"
              ><i class="icon-copy dw dw-user"></i>{{ me.name }}</span
            >
          </a>
          <div
            :class="{
              'dropdown-menu dropdown-menu-right dropdown-menu-icon-list': true,
              show: settings == true,
            }"
          >
            <a class="dropdown-item" href="profile.html"
              ><i class="dw dw-user1"></i> Profile</a
            >
            <a class="dropdown-item" href="profile.html"
              ><i class="dw dw-settings2"></i> Setting</a
            >
            <a class="dropdown-item" href="faq.html"
              ><i class="dw dw-help"></i> Help</a
            >
            <a class="dropdown-item" href="login.html"
              ><i class="dw dw-logout"></i> Log Out</a
            >
          </div>
        </div>
      </div>
      <div class="github-link">
        <a href="https://github.com/dropways/deskapp" target="_blank"
          ><img src="/vendors/images/github.svg" alt=""
        /></a>
      </div>
    </div>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { defineComponent } from "vue";
import { useAuthStore } from "../../../stores/auth";

export default defineComponent({
  setup() {
    const { me } = storeToRefs(useAuthStore());
    let settings = false;
    const showSettings = () => {
      settings = !settings;
      
      console.log(settings);
    };
    return {
      settings,
      me,
      showSettings,
    };
  },
});
</script>
