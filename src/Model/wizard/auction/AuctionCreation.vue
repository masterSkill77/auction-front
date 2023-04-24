<template>
  <div class="pd-20 card-box height-100-p mb-30">
    <div class="clearfix mb-30">
      <div class="pull-left">
        <h4 class="text-blue h4">Bootstrap TouchSpin</h4>
      </div>
    </div>
    <div>
      <div class="row">
        <div class="col-md-6 col-sm-12">
          <div class="form-group">
            <label>{{ $t("bid.start_price") }}</label>
            <div
              class="input-group bootstrap-touchspin bootstrap-touchspin-injected"
            >
              <span
                class="input-group-addon bootstrap-touchspin-prefix input-group-prepend"
                ><span class="input-group-text">$</span></span
              ><input
                id="demo2"
                type="number"
                v-model="auction.start_price"
                name="demo2"
                class="form-control"
              />
            </div>
          </div>
        </div>
        <div class="col-md-6 col-sm-12">
          <div class="form-group">
            <label>{{ $t("bid.end_date") }}</label>
            <div
              class="input-group bootstrap-touchspin bootstrap-touchspin-injected"
            >
              <input
                id="demo2"
                type="datetime-local"
                v-model="auction.end_date"
                name="demo2"
                class="form-control"
              />
            </div>
          </div>
        </div>
        <div class="col-md-6 col-sm-12">
          <div class="form-group">
            <label>{{ $t("creation.nft.title") }}</label>
            <select
              v-model="auction.nft_id"
              class="custom-select2 form-control"
              name="state"
              style="width: 100%; height: 38px"
              tabindex="-1"
              aria-hidden="true"
            >
              <option v-for="myNft in myNfts" :key="myNft.id" :value="myNft.id">
                {{ myNft.title }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="btn btn-primary mb-3" @click="createAuction">
      {{ $t("form.button.submit") }}
    </div>
  </div>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useNftStore } from "@/stores/nft";
import { ref } from "vue";
import { useAuctionStore } from "../../../stores/auction";

const myNfts = await useNftStore().fetchMyAvailableNfts();
let auction = ref({});
const createAuction = async function () {
  auction.value.start_date = new Date();
  await useAuctionStore().createAuction(auction.value);
};
</script>
