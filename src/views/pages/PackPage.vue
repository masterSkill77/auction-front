<template>
  <div class="contact-directory-list">
    <ul class="row">
      <li
        class="col-xl-4 col-lg-4 col-md-6 col-sm-12 hvr-float-shadow"
        style="cursor: pointer !important"
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
                {{ $t("pack.price") }} :
                <b>{{ new Intl.NumberFormat().format(pack.pack_price) }}</b> $ -
                <b>{{ $t("pack.licence") }}</b>
              </p>
            </div>
            <div class="profile-sort-desc">
              <ul>
                <li>
                  {{ $t("pack.nft_creation") }} :
                  <b>{{
                    new Intl.NumberFormat().format(pack.pack_max_nft_creation)
                  }}</b>
                </li>
                <li>
                  {{ $t("pack.auction_creation") }} :
                  <b>{{
                    new Intl.NumberFormat().format(
                      pack.pack_max_auction_creation
                    )
                  }}</b>
                </li>
                <li>
                  {{ $t("pack.max_bid") }} :
                  <b>{{ new Intl.NumberFormat().format(pack.pack_max_bid) }}</b>
                </li>
                <li></li>
              </ul>
            </div>
          </div>
          <div class="view-contact">
            <a
              data-toggle="modal"
              data-target="#updatePack"
              href="/profile/upgrade-pack"
              @click.prevent="
                show = true;
                packChosen = pack.id;
              "
              v-if="pack.id != me.pack.id && pack.id > me.pack.id"
              >Upgrade pack</a
            >
          </div>
        </div>
      </li>
    </ul>
    <Transport to="body">
      <div
        :class="{ 'modal fade': true, show: show }"
        id="updatePack"
        tabindex="-1"
        role="dialog"
        aria-labelledby="updatePackTitle"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">
                Modal title
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
                @click.prevent="show = false"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <PackUpgradePaiement :packId="packChosen" />
            </div>
          </div>
        </div>
      </div>
    </Transport>
  </div>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "../../stores/auth";
import { storeToRefs } from "pinia";
import PackUpgradePaiement from "@/components/UI/pack/PackUpgradePaiement.vue";
export default {
  components: {
    PackUpgradePaiement,
  },
  data() {
    return {
      packs: [],
      packChosen: null,
      me: {},
      show: false,
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
