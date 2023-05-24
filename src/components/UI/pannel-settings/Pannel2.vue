<template>
  <div class="card-box height-100-p overflow-hidden">
    <div class="profile-tab height-100-p">
      <div class="tab height-100-p">
        <ul class="nav nav-tabs customtab" role="tablist">
          <li class="nav-item">
            <a
              class="nav-link"
              data-toggle="tab"
              href="#setting"
              role="tab"
              aria-selected="true"
              >Settings</a
            >
          </li>
        </ul>
        <div class="tab-content">
          <!-- Timeline Tab start -->
          <!-- Tasks Tab End -->
          <!-- Setting Tab start -->
          <div
            class="tab-pane fade active show height-100-p"
            id="setting"
            role="tabpanel"
          >
            <div class="profile-setting">
              <register-page
                @updateProfile="updateProfile"
                :updateProfile="true"
              />
            </div>
          </div>
          <!-- Setting Tab End -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RegisterPage from "../../../views/auth/RegisterPage.vue";
export default {
  components: {
    "register-page": RegisterPage,
  },
  methods: {
    updateProfile: async () => {},
  },
};
</script>
