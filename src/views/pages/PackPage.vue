<template>
  <div class="contact-directory-list">
    <ul class="row">
      <li
        class="col-xl-4 col-lg-4 col-md-6 col-sm-12"
        v-for="pack in packs"
        :key="pack.id"
      >
        <div class="contact-directory-box" style="border: 1px solid grey">
          <div class="contact-dire-info text-center">
            <div class="contact-avatar">
              <span>
                <img src="/vendors/images/photo2.jpg" alt="" />
              </span>
            </div>
            <div class="contact-name">
              <h4>{{ pack.pack_name }}</h4>
              <p>
                Price : {{ new Intl.NumberFormat().format(pack.pack_price) }} $
                - LIFETIME PRICE
              </p>
            </div>
            <div class="profile-sort-desc">
              <ul>
                <li>
                  NFT Création :
                  {{
                    new Intl.NumberFormat().format(pack.pack_max_nft_creation)
                  }}
                </li>
                <li>
                  Auction Création :
                  {{
                    new Intl.NumberFormat().format(
                      pack.pack_max_auction_creation
                    )
                  }}
                </li>
                <li>
                  Bid : {{ new Intl.NumberFormat().format(pack.pack_max_bid) }}
                </li>
                <li></li>
              </ul>
            </div>
          </div>
          <div class="view-contact">
            <router-link to="/profile/upgrade-pack" v-if="pack.id != me.pack.id"
              >Upgrade pack</router-link
            >
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "../../stores/auth";
import { storeToRefs } from "pinia";
export default {
  data() {
    return {
      packs: [],
      me: {},
    };
  },
  async mounted() {
    const { me } = storeToRefs(useAuthStore());
    this.me = me.value;
    await axios
      .get(import.meta.env.VITE_APP_BACKEND_URL + "/pack")
      .then(({ data }) => (this.packs = data));
  },
};
</script>

<style></style>
