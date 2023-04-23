<template>
  <section class="cryptos-feature-area section-padding-0-0">
    <div class="min-height-200px">
      <AuctionsAdmin
        :auctions="allAuctions.own_auctions"
        :title="'My own auctions'"
      />
      <AuctionsAdmin
        :auctions="allAuctions.win_auctions"
        :title="'My win auctions'"
      />
    </div>
  </section>
</template>

<script>
import { useAuctionStore } from "../../stores/auction";

import { defineComponent, ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import AuctionsAdmin from "./AuctionsAdmin.vue";

export default defineComponent({
  components: { AuctionsAdmin },
  async setup() {
    let allAuctions = ref({});
    return {
      allAuctions,
    };
  },
  methods: {
    async fetchData() {
      await useAuctionStore().fetchMyAuctions();
      const { myAuctions } = storeToRefs(useAuctionStore());
      this.allAuctions = myAuctions.value;
    },
  },
  async mounted() {
    this.fetchData();
    const { myAuctions } = storeToRefs(useAuctionStore());
    this.allAuctions = myAuctions.value;
    console.log(this.allAuctions);
  },
});
</script>

<style></style>
