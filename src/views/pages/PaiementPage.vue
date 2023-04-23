<template>
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
          <div id="card-element" class="form-control"></div>
        </div>
        <div class="form-group">
          <label for="card-expiry">Expiration Date</label>
          <div id="card-expiry" class="form-control"></div>
        </div>
        <div class="form-group">
          <label for="card-cvc">CVC</label>
          <div id="card-cvc" class="form-control"></div>
        </div>
      </StripeElements>
      <button type="button" class="btn btn-primary mt-3" @click="pay">
        Pay
      </button>
    </div>
  </div>
</template>

<script>
import { StripeElements, StripeElement } from "vue-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { defineComponent, ref, onBeforeMount } from "vue";

export default defineComponent({
  name: "CardOnly",

  components: {
    StripeElements,
    StripeElement,
  },

  setup() {
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
    const card = ref();
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
      card,
      elms,
    };
  },

  methods: {
    pay() {
      // Get stripe element
      const cardElement = this.card.stripeElement;

      // Access instance methods, e.g. createToken()
      this.elms.instance.createToken(cardElement).then((result) => {
        // Handle result.error or result.token
        console.log(result);
      });
    },
  },
});
</script>
