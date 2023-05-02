<template>
  <div
    class="login-page register-page-wrap d-flex align-items-center flex-wrap justify-content-center"
  >
    <div class="container-fluid">
      <div class="row align-items-center">
        <div class="col-md-6 col-lg-6">
          <img src="vendors/images/register-page-img.png" alt="" />
        </div>
        <div class="col-md-6 col-lg-6">
          <div class="register-box-5 p-5 bg-white box-shadow border-radius-10">
            <div class="wizard-content">
              <VrWizard
                :options="options"
                :id="id"
                :states="states"
                :initial="initial"
                :onComplete="onComplete"
                :context="context"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import VrWizard from "@vurian/wizard";
import PersonnalInfo from "./components/steps/PersonnalInfo.vue";
import CardInfo from "./components/steps/CardInfo.vue";
import AccountInfo from "./components/steps/AccountInfo.vue";

const context = {
  completedSteps: [],
  cart: [],
  shipping: {
    address: "",
    phone: "",
    email: "",
    id: "",
  },
  shippingMethod: "",
  billing: {
    address: "",
  },
  agreeToTerms: false,
  paymentMethod: "",
};

const states = {
  info_perso: {
    title: "Personnal Info",
    id: "info_perso",
    stepView: PersonnalInfo,
    order: 0,
    meta: {
      description: "Review your personnal info",
    },
  },
  info_account: {
    title: "Account",
    id: "info_account",
    stepView: AccountInfo,
    order: 0,
    meta: {
      description: "Review your personnal info",
    },
  },
  info_card: {
    title: "Card Info",
    id: "info_card",
    stepView: CardInfo,
    order: 0,
    meta: {
      description: "Review your personnal info",
    },
  },
};
const options = {
  guards: {
    isAgreeToTerm: (ctx) => ctx.agreeToTerms && !!ctx.paymentMethod,
  },
};

const onComplete = async () => {
  console.log("done");
};

const id = "checkout";
const initial = "info_perso";
</script>

<style>
:root {
  --wizard-stepper--active: rgba(29, 27, 8, 0.479);
  --wizard-line-color: black;
}
</style>
