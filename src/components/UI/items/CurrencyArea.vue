<template>
  <div class="col-12 col-lg-5">
    <div class="cryptos-prices-table">
      <!-- Single Price Table -->
      <div
        v-for="(crypto, index) in cryptos"
        :key="index"
        class="single-price-table d-flex align-items-center justify-content-between"
      >
        <div class="p-content d-flex align-items-center">
          <span></span>
          <img src="img/bg-img/bitcoin.png" alt="" />
          <p>{{ crypto.symbol }}</p>
        </div>
        <div class="p-content d-flex align-items-center">
          <p>{{ crypto.lastPrice }} $</p>
        </div>
        <div class="p-content d-flex align-items-center">
          <div
            :class="{
              price: true,
              increase: crypto.priceChange > 0,
              decrease: crypto.priceChange < 0,
            }"
          >
            <p>{{ crypto.priceChangePercent }} %</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      cryptos: [],
    };
  },
  async mounted() {
    await axios
      .get(import.meta.env.VITE_APP_BACKEND_URL + "/ticker")
      .then((res) => (this.cryptos = res.data));
  },
};
</script>
