<template>
	<div class="col-12 col-lg-5 col-sm-12" v-if="!header">
		<div class="cryptos-prices-table m-auto">
			<!-- Single Price Table -->
			<div
				v-for="(crypto, index) in cryptos"
				:key="index"
				class="single-price-table d-flex align-items-center justify-content-between">
				<div class="p-content d-flex align-items-center">
					<span></span>
					<img src="/public/img/bg-img/bitcoin.png" alt="" />
					<p>{{ crypto.symbol }}</p>
				</div>
				<div class="p-content d-flex align-items-center">
					<p>{{ crypto.lastPrice }} $</p>
				</div>
				<div class="p-content d-flex align-items-center">
					<div
						:class="{
							price: true,
							increase: crypto.priceChange > 0,
							decrease: crypto.priceChange < 0,
						}">
						<p>{{ crypto.priceChangePercent }} %</p>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="w-100 cursor-pointer">
		<Vue3Marquee :duration="50" v-if="header">
			<div
				v-for="(crypto, index) in cryptos"
				:key="index"
				class="single-price-table d-flex align-items-center justify-content-between">
				<div class="p-content d-flex align-items-center">
					<span></span>
					<img src="/public/img/bg-img/bitcoin.png" alt="" />
					<p>{{ crypto.symbol }}</p>
				</div>
				<div class="p-content mx-2">
					<p>{{ crypto.lastPrice }} $</p>
				</div>
				<div class="p-content mx-2">
					<div
						:class="{
							'price pb-0': true,
							increase: crypto.priceChange > 0,
							decrease: crypto.priceChange < 0,
						}">
						<p>{{ crypto.priceChangePercent }} %</p>
					</div>
				</div>
			</div>
		</Vue3Marquee>
	</div>
</template>

<script>
	import axios from 'axios';
	import 'vue3-marquee/dist/style.css';
	import { Vue3Marquee } from 'vue3-marquee';

	export default {
		props: ['header'],
		components: {
			Vue3Marquee,
		},
		methods: {
			shuffle: (array) => {
				let currentIndex = array.length,
					randomIndex;

				// While there remain elements to shuffle.
				while (currentIndex != 0) {
					// Pick a remaining element.
					randomIndex = Math.floor(Math.random() * currentIndex);
					currentIndex--;

					// And swap it with the current element.
					[array[currentIndex], array[randomIndex]] = [
						array[randomIndex],
						array[currentIndex],
					];
				}

				return array;
			},
		},
		data() {
			return {
				cryptos: [],
			};
		},
		async mounted() {
			await axios
				.get(import.meta.env.VITE_APP_BACKEND_URL + '/ticker')
				.then((res) => (this.cryptos = this.shuffle(res.data).slice(0, 7)));
		},
	};
</script>

<style>
	.cursor-pointer {
		cursor: pointer;
	}
</style>
