<template>
  <section class="cryptos-feature-area section-padding-100-0 mb-5">
    <div class="row">
      <div class="col-5 col-lg-5">
        <div class="card m-auto text-center">
          <img class="card-img-top w-50 mt-5 mx-auto" :src="auction.nft.image_uri" alt="Card image cap" />
          <div class="card-body">
            <h5 class="card-title">{{ auction.nft.title }}</h5>
            <p class="card-text">
              {{ auction.nft.description }}
            </p>
            <div v-if="auction.owner.id != me.id && new Date(auction.end_date).getTime() - new Date().getTime() > 0">
              <a href="#" class="btn btn-primary" data-toggle="modal"
                data-target="#exampleModal">{{  $t('bid.button')  }}</a>
            </div>

          </div>
          <div class="card-footer text-muted" v-if="new Date(auction.end_date).getTime() - new Date().getTime() > 0">
            <vue-countdown :time="
                new Date(auction.end_date).getTime() - new Date().getTime()
              " v-slot="{ days, hours, minutes, seconds }">
              <b>
                {{ $t("timer.remaining") }}：{{ days }} {{ $t('timer.day') }}, {{ hours }} {{ $t('timer.hour') }},
                {{ minutes }} {{ $t('timer.minute') }}, {{ seconds }} {{ $t('timer.second') }}.
              </b>
            </vue-countdown>
          </div>
        </div>
      </div>
      <div class="col-7 col-lg-7">
        <div class="cryptos-tabs-content">
          <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item">
              <a class="nav-link active" id="tab--1" data-toggle="tab" href="#tab1" role="tab" aria-controls="tab1"
                aria-selected="false">{{ $t('auction.owner') }}</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" id="tab--2" data-toggle="tab" href="#tab2" role="tab" aria-controls="tab2"
                aria-selected="false">{{ $t('auction.details') }}</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" id="tab--3" data-toggle="tab" href="#tab3" role="tab" aria-controls="tab3"
                aria-selected="true">{{ $t('bid.title') }}s</a>
            </li>
          </ul>

          <div class="tab-content mb-100" id="myTabContent">
            <div class="tab-pane fade  show active" id="tab1" role="tabpanel" aria-labelledby="tab--1">
              <div class="cryptos-tab-content">
                <!-- Tab Text -->
                <div class="cryptos-tab-text">
                  <p>
                    <ul class="list-group list-group-flush">
                      <li class="list-group-item">{{ $t("personnalInfo.name") }}:
                        {{ auction.owner.name + " " + auction.owner.lastname }}
                       <router-link :to="`/profile/user/${auction.owner.id}`" v-if="auction.owner.id != me.id"><button class="btn btn-outline-success btn-sm">Profil</button> </router-link></li>
                      <li class="list-group-item">{{ $t("personnalInfo.username") }} : {{ auction.owner.username }}</li>
                      <li class="list-group-item">{{ $t("personnalInfo.email") }} : {{ auction.owner.email }}</li>
                    </ul>
                  </p>
                </div>
              </div>
            </div>
            <div class="tab-pane fade" id="tab2" role="tabpanel" aria-labelledby="tab--2">
              <div class="cryptos-tab-content">
                <!-- Tab Text -->
                <div class="cryptos-tab-text">
                  <p>
                    <ul class="list-group list-group-flush">
                      <li class="list-group-item">{{ $t('bid.start_price') }} : $ {{ auction.start_price }}</li>
                      <li class="list-group-item">{{ $t('bid.current_bid') }} : $
                        {{ new Intl.NumberFormat('fr').format(auction.current_bid) }}</li>
                      <li class="list-group-item">{{ $t('bid.start_date') }} : {{ auction.start_date }}</li>
                    </ul>
                  </p>
                </div>
              </div>
            </div>
            <div class="tab-pane fade" id="tab3" role="tabpanel" aria-labelledby="tab--3">
              <div class="cryptos-tab-content">
                <!-- Tab Text -->
                <div class="cryptos-tab-text">
                  <p>
                    <table class="table">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">{{  $t('personnalInfo.user') }}</th>
                          <th scope="col">{{ $t('bid.amount') }} ($)</th>
                          <th scope="col">{{ $t('bid.date')}}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="bid in auction.bids.reverse()" :key="bid.id">
                          <th scope="row">{{ bid.id }}</th>
                          <td>{{ bid.bidder.name + " " + bid.bidder.lastname }} <router-link :to="`/profile/user/${bid.bidder.id}`" v-if="bid.bidder.id  != me.id"><button class="btn btn-outline-success btn-sm">Profil</button> </router-link></td>
                          <td>{{  new Intl.NumberFormat('fr').format(bid.bid_amount ) }}</td>
                          <td>{{  formatMoment(bid.created_at).fromNow()  }}</td>
                        </tr>

                      </tbody>
                    </table>

                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Teleport to="body" v-if="auction.owner.id != me.id && new Date(auction.end_date).getTime() - new Date().getTime() > 0">
        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
          aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">{{ $t('bid.title') }}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <form @submit.prevent="makeBid">
                <div class="modal-body">
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text">$</span>
                    </div>
                    <input type="text" class="form-control" v-model="bid" required min="0"
                      aria-label="Amount (to the nearest dollar)" >
                    <div class="input-group-append">
                      <span class="input-group-text">.00</span>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">{{ $t('form.button.close') }}</button>
                  <button type="submit" class="btn btn-primary" :disabled="loading">
                    <span  v-if="loading" class="spinner-border spinner-border-sm" role="status">
                  </span>
                    <span v-else>{{  $t('bid.make_bid')  }}</span>  
                  </button>
                  
                </div>
              </form>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </section>
</template>
<script>
import moment from "moment"
import { useI18nStore } from "../../stores/i18n";
  import {
    storeToRefs
  } from "pinia";
  import {
    defineComponent,
    onBeforeMount,
    ref
  } from "vue";
  import {
    useRoute
  } from "vue-router";
  import {
    useAuctionStore
  } from "../../stores/auction";
  import {
    useAuthStore
  } from "../../stores/auth";

  import {
    useBidStore
  } from "../../stores/bid"

  export default defineComponent({
    methods: {
      async makeBid() {
        this.loading = true
        const body = {
          bidder_id: this.me.id,
          bid_amount: this.bid,
          auction_id: this.auctionId
        }
        const response = await useBidStore().makeBid(body).then((data => {
          this.$notify({
            title: this.$t('success.title'),
            text: this.$t('success.bid'),
            type: 'success'
          });
        })).catch(({
          response
        }) => {
          if (response.data.error)
            this.$notify({
              title: this.$t('error.title'),
              text: this.$t('error.' + response.data.error),
              type: "error",
            });
        });

        this.auction = await useAuctionStore().fetchAuction(this.auctionId);
        this.bid = this.auction.current_bid
        this.loading = false
      }
    },
    mounted() {
      const $ = this;
      window.Echo.channel("auction").listen(
        ".auction-done",
        async function (data) {
          this.auction = await useAuctionStore().fetchAuction(auctionId);
        }
      );
    },
    setup() {
      const {
        me
      } = storeToRefs(useAuthStore());
      const auction = ref({
        nft: {}
      });
      const bid = ref(0);
      const route = useRoute();
      let auctionId = ref()
      let loading = ref(false);
      auctionId.value = route.params.auctionId;

      onBeforeMount(async () => {
        moment.locale('fr', {
    months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
    monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
    monthsParseExact : true,
    weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
    weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
    weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Aujourd’hui à] LT',
        nextDay : '[Demain à] LT',
        nextWeek : 'dddd [à] LT',
        lastDay : '[Hier à] LT',
        lastWeek : 'dddd [dernier à] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'dans %s',
        past : 'il y a %s',
        s : 'quelques secondes',
        m : 'une minute',
        mm : '%d minutes',
        h : 'une heure',
        hh : '%d heures',
        d : 'un jour',
        dd : '%d jours',
        M : 'un mois',
        MM : '%d mois',
        y : 'un an',
        yy : '%d ans'
    },
    dayOfMonthOrdinalParse : /\d{1,2}(er|e)/,
    ordinal : function (number) {
        return number + (number === 1 ? 'er' : 'e');
    },
    meridiemParse : /PD|MD/,
    isPM : function (input) {
        return input.charAt(0) === 'M';
    },
    // In case the meridiem units are not separated around 12, then implement
    // this function (look at locale/id.js for an example).
    // meridiemHour : function (hour, meridiem) {
    //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
    // },
    meridiem : function (hours, minutes, isLower) {
        return hours < 12 ? 'PD' : 'MD';
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // Used to determine first week of the year.
    }
});


        auction.value = await useAuctionStore().fetchAuction(auctionId.value);
        bid.value = auction.value.current_bid == 0 ? auction.value.start_price : auction.value.current_bid
      });

     const formatMoment = (date) => {
       moment.locale(useI18nStore().currentLocale)
        return moment(date)
      }

      return {
        auction,
        formatMoment,
        auctionId,
        bid,
        me,
        loading
      };
    },
  });
</script>