<template>
  <div class="contact-directory-list">
    <ul class="row">
      <li
        class="col-xl-4 col-lg-4 col-md-6 col-sm-12"
        v-for="pack in packs"
        :key="pack.id"
      >
        <div class="contact-directory-box bg-secondary">
          <div class="contact-dire-info text-center">
            <div class="contact-avatar">
              <span>
                <img src="/vendors/images/photo2.jpg" alt="" />
              </span>
            </div>
            <div class="contact-name">
              <h4>{{ pack.pack_name }}</h4>
              <p>Price : {{ pack.pack_price }} LIFETIME</p>
            </div>
            <div class="profile-sort-desc">
              <ul>
                <li>NFT Création : {{ pack.pack_max_nft_creation }}</li>
                <li>Auction Création : {{ pack.pack_max_auction_creation }}</li>
                <li>Bid : {{ pack.pack_max_bid }}</li>
                <li></li>
              </ul>
            </div>
          </div>
          <div class="view-contact">
            <a href="#">View Profile</a>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      packs: [],
    };
  },
  async mounted() {
    await axios
      .get(import.meta.env.VITE_APP_BACKEND_URL + "/pack")
      .then(({ data }) => (this.packs = data));

    console.log(this.packs);
  },
};
</script>

<style></style>
