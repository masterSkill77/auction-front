<template>
  <div class="pd-ltr-20 xs-pd-20-10">
    <div class="min-height-200px">
      <div class="row">
        <div class="col-xl-4 col-lg-4 col-md-4 col-sm-12 mb-30">
          <div class="pd-20 card-box height-100-p">
            <ContactInfo />
          </div>
        </div>
        <div class="col-xl-8 col-lg-8 col-md-8 col-sm-12 mb-30">
          <Pannel2 />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Pannel2 from "../../components/UI/pannel-settings/Pannel2.vue";
import ContactInfo from "../../components/UI/pannel-settings/ContactInfo.vue";
</script>
