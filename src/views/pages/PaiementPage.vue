<template>
  <div class="blog-area section-padding-100">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 col-xl-6 col-md-6">
          <div class="w-100">
            <img
              src="/img/concept-nft-futuriste-plat_23-2148936480.jpg"
              alt=""
            />
          </div>
        </div>
        <div class="col-lg-6 col-xl-6 col-md-6 mt-xl-5 pt-xl-3">
          <h2 class="text-center">Paiement</h2>
          <div class="card mx-auto mt-5">
            <div class="card-body">
              <StripeElements
                v-if="stripeLoaded"
                v-slot="{ elements, instance }"
                ref="elms"
                :stripe-key="stripeKey"
                :instance-options="instanceOptions"
                :elements-options="elementsOptions"
              >
                <div class="form-group">
                  <label for="card-element">Card Number</label>
                  <input
                    id="card-element"
                    type="tel"
                    inputmode="numeric"
                    pattern="[0-9\s]{16}"
                    autocomplete="cc-number"
                    maxlength="16"
                    minlength="16"
                    placeholder="xxxx xxxx xxxx xxxx"
                    v-model="card.cardNumber"
                    class="form-control"
                  />
                </div>
                <div class="form-group">
                  <label for="card-expiry">Expiration Date</label>
                  <input
                    type="month"
                    id="card-expiry"
                    class="form-control"
                    v-model="card.expiryDate"
                  />
                </div>
                <div class="form-group">
                  <label for="card-cvc">CVC</label>
                  <input
                    id="card-cvc"
                    class="form-control"
                    v-model="card.cvc"
                  />
                </div>
              </StripeElements>
              <button
                type="button"
                class="btn btn-success mt-3 mr-2"
                @click="payAnother"
              >
                Pay with another card
              </button>
              <button type="button" class="btn btn-success mt-3" @click="pay">
                Pay with my configured card
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { StripeElements, StripeElement } from "vue-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { defineComponent, ref, onBeforeMount } from "vue";
import { useAuctionStore } from "./../../stores/auction";
import axios from "@/src/axios";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "CardOnly",

  components: {
    StripeElements,
    StripeElement,
  },
  setup() {
    const route = useRoute();
    const stripeKey = ref(import.meta.env.VITE_STRIPE_KEY); // test key
    const instanceOptions = ref({
      // https://stripe.com/docs/js/initializing#init_stripe_js-options
    });
    const elementsOptions = ref({
      // https://stripe.com/docs/js/elements_object/create#stripe_elements-options
      style: {
        base: {
          fontFamily: "Arial, sans-serif",
          fontSize: "16px",
          color: "#32325d",
        },
      },
    });
    const cardOptions = ref({
      // https://stripe.com/docs/stripe.js#element-options
      classes: {
        base: "form-control",
      },
    });
    const stripeLoaded = ref(false);
    const elms = ref();

    onBeforeMount(() => {
      const stripePromise = loadStripe(stripeKey.value);
      stripePromise.then(() => {
        stripeLoaded.value = true;
      });
    });

    return {
      stripeKey,
      stripeLoaded,
      instanceOptions,
      elementsOptions,
      cardOptions,
      route,
      elms,
    };
  },
  data() {
    return {
      auction: {},
      card: {},
    };
  },
  async mounted() {
    const auctionId = this.route.params.uuid;
    this.auction = await useAuctionStore().fetchAuction(auctionId);
    if (this.auction.status == 1) this.$router.push("404");
  },
  methods: {
    async pay() {
      await axios
        .post("/paiement", { auction_id: this.auction.id })
        .then((response) => console.log(response.data));
    },
    async payAnother() {},
  },
});
</script>
