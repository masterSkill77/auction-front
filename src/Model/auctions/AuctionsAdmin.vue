<template>
  <div class="page-header">
    <div class="row">
      <div class="col-md-12 col-sm-12">
        <div class="title">
          <h4>{{ title }}</h4>
        </div>
      </div>
    </div>
  </div>
  <div class="product-wrap">
    <div class="product-list">
      <ul class="row">
        <li
          v-for="auction in auctions"
          :key="auction.id"
          class="col-lg-4 col-md-6 col-sm-12"
        >
          <div class="product-box">
            <div class="producct-img">
              <img :src="auction.nft.image_uri" alt="" />
            </div>
            <div class="product-caption">
              <h4>
                <a href="#">{{ auction.nft.title }}</a>
              </h4>
              <div class="price">
                Current bid :<ins
                  >$
                  {{
                    new Intl.NumberFormat("fr").format(auction.current_bid)
                  }}</ins
                >
                Start price :<ins
                  >$
                  {{
                    new Intl.NumberFormat("fr").format(auction.start_price)
                  }}</ins
                >
              </div>
              <router-link
                class="btn btn-outline-primary"
                :to="`/auction/${auction.auction_uuid}`"
                >Read More</router-link
              >
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: ["auctions", "title"],
};
</script>
