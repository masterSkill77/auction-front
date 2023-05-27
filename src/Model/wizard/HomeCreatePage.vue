<template>
  <div class="row">
    <!-- Single Course Area -->
    <router-link
      to="/profile/create/nft"
      class="col-12 col-md-6 col-xl-6"
      style="cursor: pointer !important"
    >
      <div class="single-feature-area mb-100 text-center text-bold">
        <div>
          <i class="icon-bitcoin"></i>
          <h3>{{ $t("creation.nft.title") }}</h3>
          <p style="font-weight: bold">
            {{ $t("creation.nft.description") }}
          </p>
        </div>
      </div>
    </router-link>

    <!-- Single Course Area -->
    <router-link
      to="/profile/create/auction"
      class="col-12 col-md-6 col-xl-6"
      style="cursor: pointer !important"
    >
      <div class="single-feature-area mb-100 text-center">
        <i class="icon-safebox"></i>
        <h3>{{ $t("creation.auction.title") }}</h3>
        <p style="font-weight: bold">
          {{ $t("creation.auction.description") }}
        </p>
      </div>
    </router-link>
  </div>
</template>
<script>
export default {};
</script>
