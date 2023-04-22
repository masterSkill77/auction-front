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
