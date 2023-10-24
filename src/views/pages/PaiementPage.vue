<template>
	<div class="blog-area section-padding-100">
		<div class="container">
			<div class="row">
				<div class="col-lg-6 col-xl-6 col-md-6">
					<div class="w-100">
						<img
							src="./img/concept-nft-futuriste-plat_23-2148936480.jpg"
							alt="" />
					</div>
				</div>
				<div class="col-lg-6 col-xl-6 col-md-6 mt-xl-5 pt-xl-3">
					<h2 class="text-center">Paiement</h2>
					<div class="card mx-auto mt-5">
						<div class="card-body">
							<div>
								<ul>
									<li>
										{{ $t('auction.owner') }} :
										<b>{{ auction.owner?.username }}</b>
									</li>
									<li>
										{{ $t('auction.title') }} : <b>{{ auction.nft?.title }}</b>
									</li>
									<li>
										{{ $t('auction.paymentType') }} :
										<b>{{ auction.payment == 'USDT' ? 'Cash ($)' : 'ETH' }}</b>
									</li>
									<li>
										{{ $t('bid.amount') }} :
										<b
											>{{ auction.payment == 'USDT' ? '$' : 'ETH' }}
											{{ auction.current_bid }}</b
										>
									</li>
								</ul>
							</div>
							<div class="text-center">
								<button
									type="button"
									:disabled="isPaying"
									class="btn btn-success mt-3 mr-2"
									@click="payWithCrypto"
									v-if="auction.payment == 'ETH'">
									Paiement par cryptomonnaie ETH
								</button>
								<button
									v-else
									type="button"
									:disabled="isPaying"
									class="btn btn-success mt-3"
									@click="pay">
									Pay with my configured card
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { StripeElements, StripeElement } from 'vue-stripe-js';
	import { loadStripe } from '@stripe/stripe-js';
	import { defineComponent, ref, onBeforeMount } from 'vue';
	import { useAuctionStore } from './../../stores/auction';
	import axios from '@/src/axios';
	import { useRoute } from 'vue-router';

	export default defineComponent({
		name: 'CardOnly',

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
						fontFamily: 'Arial, sans-serif',
						fontSize: '16px',
						color: '#32325d',
					},
				},
			});
			const cardOptions = ref({
				// https://stripe.com/docs/stripe.js#element-options
				classes: {
					base: 'form-control',
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
				isPaying: false,
			};
		},
		async mounted() {
			const auctionId = this.route.params.uuid;
			this.auction = await useAuctionStore().fetchAuction(auctionId);
			if (this.auction.is_paid == 1) this.$router.push('404');
		},
		methods: {
			async pay() {
				this.isPaying = true;
				const $ = this;
				await axios
					.post('/paiement', { auction_id: this.auction.id })
					.then((response) => {
						$.$notify({
							title: this.$t('success.title'),
							text: this.$t('success.payment'),
							type: 'success',
						});
						$.$router.back();
					});
			},
			async payWithCrypto() {
				this.isPaying = true;
				const $ = this;
				await axios
					.post('/paiement', { auction_id: this.auction.id })
					.then((response) => {
						$.$notify({
							title: this.$t('success.title'),
							text: this.$t('success.payment'),
							type: 'success',
						});
						$.$router.back();
					});
			},
		},
	});
</script>
