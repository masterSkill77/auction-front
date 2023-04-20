<template>
  <section class="cryptos-feature-area section-padding-100-0">
    <div class="row">
      <div class="col-12">
        <div class="section-heading text-center mx-auto">
          <h3>Let’s change <br /><span>the world</span> together</h3>
          <p>
            Cras vitae turpis lacinia, lacinia lacus non, fermentum nisi. Donec
            et sollicitudin est, in euismod erat. Ut at erat et arcu pulvinar
            cursus a eget nisl. Cras vitae turpis lacinia, lacinia lacus non,
            fermentum nisi.
          </p>
        </div>
      </div>
    </div>
    {{ auctions }}
    <div class="row">
      <!-- Single Course Area -->
      <div class="col-12 col-md-4 col-xl-3">
        <div class="single-feature-area mb-100 text-center">
          <i class="icon-safebox"></i>
          <h3>Fast &amp; Easy</h3>
          <vue-countdown
            :time="2 * 24 * 60 * 60 * 1000"
            v-slot="{ days, hours, minutes, seconds }"
          >
            Time Remaining：{{ days }} days, {{ hours }} hours,
            {{ minutes }} minutes, {{ seconds }} seconds.
          </vue-countdown>
          <p>
            Cras vitae turpis lacinia, lacinia lacus non, fermentum nisi. Donec
            et sollicitudin est, in euismod erat. Ut at erat et arcu pulvinar
            cursus a eget nisl. Cras vitae turpis lacinia, lacinia lacus non,
            fermentum.
          </p>
          <a href="#" class="btn cryptos-btn">Read More</a>
        </div>
      </div>

      <!-- Single Course Area -->
      <div class="col-12 col-md-4 col-xl-3">
        <div class="single-feature-area mb-100 text-center">
          <i class="icon-bitcoin"></i>
          <h3>No strigs attached</h3>
          <vue-countdown
            :time="2 * 24 * 60 * 60 * 1000"
            v-slot="{ days, hours, minutes, seconds }"
          >
            Time Remaining：{{ days }} days, {{ hours }} hours,
            {{ minutes }} minutes, {{ seconds }} seconds.
          </vue-countdown>
          <p>
            Cras vitae turpis lacinia, lacinia lacus non, fermentum nisi. Donec
            et sollicitudin est, in euismod erat. Ut at erat et arcu pulvinar
            cursus a eget nisl. Cras vitae turpis lacinia, lacinia lacus non,
            fermentum.
          </p>
          <a href="#" class="btn cryptos-btn">Read More</a>
        </div>
      </div>

      <!-- Single Course Area -->
      <div class="col-12 col-md-4 col-xl-3">
        <div class="single-feature-area mb-100 text-center">
          <i class="icon-exchange"></i>
          <h3>Small Commisions</h3>
          <vue-countdown
            :time="2 * 24 * 60 * 60 * 1000"
            v-slot="{ days, hours, minutes, seconds }"
          >
            Time Remaining：{{ days }} days, {{ hours }} hours,
            {{ minutes }} minutes, {{ seconds }} seconds.
          </vue-countdown>
          <p>
            Cras vitae turpis lacinia, lacinia lacus non, fermentum nisi. Donec
            et sollicitudin est, in euismod erat. Ut at erat et arcu pulvinar
            cursus a eget nisl. Cras vitae turpis lacinia, lacinia lacus non,
            fermentum.
          </p>
          <a href="#" class="btn cryptos-btn">Read More</a>
        </div>
      </div>

      <!-- Single Course Area -->
      <div class="col-12 col-md-4 col-xl-3">
        <div class="single-feature-area mb-100 text-center">
          <i class="icon-wallet"></i>
          <h3>10% Secure</h3>
          <vue-countdown
            :time="2 * 24 * 60 * 60 * 1000"
            v-slot="{ days, hours, minutes, seconds }"
          >
            Time Remaining：{{ days }} days, {{ hours }} hours,
            {{ minutes }} minutes, {{ seconds }} seconds.
          </vue-countdown>
          <p>
            Cras vitae turpis lacinia, lacinia lacus non, fermentum nisi. Donec
            et sollicitudin est, in euismod erat. Ut at erat et arcu pulvinar
            cursus a eget nisl. Cras vitae turpis lacinia, lacinia lacus non,
            fermentum.
          </p>
          <a href="#" class="btn cryptos-btn">Read More</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useAuctionStore } from "../../stores/auction";

import { defineComponent, ref, onMounted } from "vue";
import { storeToRefs } from "pinia";

export default defineComponent({
  async setup() {
    const auctions = ref([]);
    onMounted(async () => {
      await useAuctionStore().setAuctions();
      const { auctions } = storeToRefs(useAuctionStore());
    });
    return {
      auctions,
    };
  },
});
</script>

<style></style>
