<template>
  <section class="cryptos-feature-area section-padding-100-0 mb-5">
    <div class="row">
      <div class="col-5 col-lg-5">
        <div class="card m-auto text-center">
          <img
            class="card-img-top w-50 mt-5 mx-auto"
            :src="auction.nft.image_uri"
            alt="Card image cap"
          />
          <div class="card-body">
            <h5 class="card-title">{{ auction.nft.title }}</h5>
            <p class="card-text">
              With supporting text below as a natural lead-in to additional
              content.
            </p>
            <a href="#" class="btn btn-primary">Make a bid</a>
          </div>
          <div class="card-footer text-muted">
            <vue-countdown
              :time="
                new Date(auction.end_date).getTime() - new Date().getTime()
              "
              v-slot="{ days, hours, minutes, seconds }"
            >
              <b>
                Time Remaining：{{ days }} days, {{ hours }} hours,
                {{ minutes }} minutes, {{ seconds }} seconds.
              </b>
            </vue-countdown>
          </div>
        </div>
      </div>
      <div class="col-7 col-lg-7">
        <div class="cryptos-tabs-content">
          <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item">
              <a
                class="nav-link active"
                id="tab--1"
                data-toggle="tab"
                href="#tab1"
                role="tab"
                aria-controls="tab1"
                aria-selected="false"
                >Owner</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                id="tab--2"
                data-toggle="tab"
                href="#tab2"
                role="tab"
                aria-controls="tab2"
                aria-selected="false"
                >Details</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                id="tab--3"
                data-toggle="tab"
                href="#tab3"
                role="tab"
                aria-controls="tab3"
                aria-selected="true"
                >Bids</a
              >
            </li>
          </ul>

          <div class="tab-content mb-100" id="myTabContent">
            <div
              class="tab-pane fade  show active"
              id="tab1"
              role="tabpanel"
              aria-labelledby="tab--1"
            >
              <div class="cryptos-tab-content">
                <!-- Tab Text -->
                <div class="cryptos-tab-text">
                  <p>
                    <ul class="list-group list-group-flush">
                    <li class="list-group-item">Name : {{ auction.owner.name + " " + auction.owner.lastname }}</li>
                    <li class="list-group-item">Username : {{ auction.owner.username }}</li>
                    <li class="list-group-item">Email : {{ auction.owner.email }}</li>
                  </ul>
                  </p>
                </div>
              </div>
            </div>
            <div
              class="tab-pane fade"
              id="tab2"
              role="tabpanel"
              aria-labelledby="tab--2"
            >
              <div class="cryptos-tab-content">
                <!-- Tab Text -->
                <div class="cryptos-tab-text">
                  <p>
                    <ul class="list-group list-group-flush">
                      <li class="list-group-item">Start price : {{ auction.start_price }}</li>
                      <li class="list-group-item">Current bid : {{ auction.current_bid }}</li>
                      <li class="list-group-item">Start date : {{ auction.start_date }}</li>
                    </ul>
                  </p>
                </div>
              </div>
            </div>
            <div
              class="tab-pane fade"
              id="tab3"
              role="tabpanel"
              aria-labelledby="tab--3"
              >
              <div class="cryptos-tab-content">
                <!-- Tab Text -->
                <div class="cryptos-tab-text">
                  <p>
                    {{ auction.bids }}

                    <ul class="list-group list-group-flush">
                      <li class="list-group-item">Start price : {{ auction.start_price }}</li>
                      <li class="list-group-item">Current bid : {{ auction.current_bid }}</li>
                      <li class="list-group-item">Start date : {{ auction.start_date }}</li>
                    </ul>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { defineComponent, onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import { useAuctionStore } from "../../stores/auction";

export default defineComponent({
  setup() {
    const auction = ref({ nft: {} });
    const route = useRoute();
    const auctionId = route.params.auctionId;

    onBeforeMount(async () => {
      auction.value = await useAuctionStore().fetchAuction(auctionId);
    });

    return {
      auction,
    };
  },
});
</script>
