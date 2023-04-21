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
    <div class="row">
      <!-- Single Course Area -->
      <div
        v-for="auction in allAuctions.data"
        :key="auction.id"
        class="col-12 col-md-4 col-xl-3"
      >
        <div class="single-feature-area mb-100 text-center">
          <img :src="auction.nft.image_uri" alt="" />
          <h3 class="my-2">{{ auction.nft.title }}</h3>
          <vue-countdown
            :time="new Date(auction.end_date).getTime() - new Date().getTime()"
            v-slot="{ days, hours, minutes, seconds }"
          >
            <b>
              Time Remaining：{{ days }} days, {{ hours }} hours,
              {{ minutes }} minutes, {{ seconds }} seconds.
            </b>
          </vue-countdown>
          <p>
            {{ auction.nft.description }}
          </p>
          <router-link :to="'/auction/' + auction.id" class="btn cryptos-btn"
            >Read More</router-link
          >
        </div>
      </div>
    </div>
    <div class="text-center w-100 m-auto">
      <Pagination
        @changePage="changePage"
        v-if="linksOfPage"
        :links="linksOfPage"
        :currentPage="allAuctions.current_page"
      />
    </div>
  </section>
</template>

<script>
import { useAuctionStore } from "../../stores/auction";

import { defineComponent, ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import Pagination from "../../components/UI/items/Pagination.vue";

console.log(window.Echo);

export default defineComponent({
  components: {
    Pagination,
  },
  computed: {
    linksOfPage() {
      return this.allAuctions.value.links;
    },
  },
  watch: {
    allAuctions: function (newValue) {
      this.linksOfPage = newValue.links;
    },
  },
  async setup() {
    let allAuctions = ref({});
    let linksOfPage = ref(allAuctions.links);
    return {
      linksOfPage,
      allAuctions,
    };
  },
  methods: {
    async changePage(pageNumber) {
      await useAuctionStore().fetchAuctionPage(pageNumber);
      const { auctions } = storeToRefs(useAuctionStore());
      this.allAuctions = auctions.value;
      this.linksOfPage = this.allAuctions.links;
    },
  },
  async mounted() {
    await useAuctionStore().fetchAuctions();
    const { auctions } = storeToRefs(useAuctionStore());
    this.allAuctions = auctions.value;
    this.linksOfPage = this.allAuctions.links;
  },
});
</script>

<style></style>
