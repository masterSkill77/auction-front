<template>
  <div class="row">
    <!-- Single Course Area -->
    <router-link
      to="/profile/create/nft"
      class="col-12 col-md-6 col-xl-6"
      style="cursor: pointer !important"
    >
      <div class="single-feature-area mb-100 text-center">
        <i class="icon-bitcoin"></i>
        <h3>{{ $t("creation.nft.title") }}</h3>
        <p>
          Cras vitae turpis lacinia, lacinia lacus non, fermentum nisi. Donec et
          sollicitudin est, in euismod erat. Ut at erat et arcu pulvinar cursus
          a eget nisl. Cras vitae turpis lacinia, lacinia lacus non, fermentum.
        </p>
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
        <p>
          Cras vitae turpis lacinia, lacinia lacus non, fermentum nisi. Donec et
          sollicitudin est, in euismod erat. Ut at erat et arcu pulvinar cursus
          a eget nisl. Cras vitae turpis lacinia, lacinia lacus non, fermentum.
        </p>
      </div>
    </router-link>
  </div>
</template>
<script>
export default {};
</script>
