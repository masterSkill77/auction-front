<template>
	<div class="pd-ltr-20" :key="key">
		<div class="card-box pd-20 height-100-p mb-30">
			<div class="row align-items-center">
				<div class="col-md-4">
					<img
						:src="
							JSON.parse(me.configuration.profile_image)[0].content ??
							'/vendors/images/banner-img.png'
						"
						alt="" />
				</div>
				<div class="col-md-8">
					<h4 class="font-20 weight-500 mb-10 text-capitalize">
						Welcome back
						<div class="weight-600 font-30 text-blue">
							{{ me.name + ' ' + me.lastname }}!
						</div>
					</h4>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-xl-3 mb-30 hvr-wobble-horizontal cursor-pointer">
				<div
					class="card-box height-100-p widget-style1 bg-secondary text-white">
					<div class="d-flex flex-wrap align-items-center">
						<div class="">
							<i class="fa-solid fa fa-btc fa-2xl w-100 text-center"></i>
						</div>
						<div class="widget-data">
							<div class="h4 mb-0">{{ me.pack.pack_name }}</div>
							<div class="weight-600 font-14">Pack</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-xl-3 mb-30 hvr-wobble-horizontal cursor-pointer">
				<div
					class="card-box height-100-p widget-style1 bg-secondary text-white">
					<div class="d-flex flex-wrap align-items-center">
						<div class="">
							<i class="fa-solid fa fa-btc fa-2xl w-100 text-center"></i>
						</div>
						<div class="widget-data">
							<div class="h4 mb-0">
								{{
									new Intl.NumberFormat('de-DE').format(me.current_allow_nft)
								}}
							</div>
							<div class="weight-600 font-14">Création NFT restant</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-xl-3 mb-30 hvr-wobble-horizontal cursor-pointer">
				<div
					class="card-box height-100-p widget-style1 bg-secondary text-white">
					<div class="d-flex flex-wrap align-items-center">
						<div class="">
							<i class="fa-solid fa fa-btc fa-2xl w-100 text-center"></i>
						</div>
						<div class="widget-data">
							<div class="h4 mb-0">
								{{
									new Intl.NumberFormat('de-DE').format(
										me.current_allow_auction
									)
								}}
							</div>
							<div class="weight-600 font-14">Création Enchere restant</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-xl-3 mb-30 hvr-wobble-horizontal cursor-pointer">
				<div
					class="card-box height-100-p widget-style1 bg-secondary text-white">
					<div class="d-flex flex-wrap align-items-center">
						<div class="">
							<i class="fa-solid fa fa-btc fa-2xl w-100 text-center"></i>
						</div>
						<div class="widget-data">
							<div class="h4 mb-0">
								{{
									new Intl.NumberFormat('de-DE').format(me.current_allow_bid)
								}}
							</div>
							<div class="weight-600 font-14">Placement d'offre restant</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-xl-3 mb-30 hvr-wobble-horizontal cursor-pointer">
				<div
					class="card-box height-100-p widget-style1 bg-secondary text-white">
					<div class="d-flex flex-wrap align-items-center">
						<div class="">
							<i class="fa-solid fa fa-btc fa-2xl w-100 text-center"></i>
						</div>
						<div class="widget-data">
							<div class="h4 mb-0">
								{{ new Intl.NumberFormat('de-DE').format(available) }} ETH
							</div>
							<div class="weight-600 font-14">Worth</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	import axios from 'axios';

	const USER_TOKEN = 'auction_user';
	const me = ref({});
	const available = ref(0);
	const key = ref(1);
	const check = () => {
		console.log(key.value);
	};
	const user = JSON.parse(localStorage.getItem(USER_TOKEN));
	key.value = Math.floor(Math.random() * 1000);
	me.value = user;
	await axios
		.get(import.meta.env.VITE_APP_NFT_URL + '/me/' + me.value.etherum_adress)
		.then((res) => {
			available.value = res.data;
			console.log(available.value);
		})
		.catch((e) => console.log(e));
</script>
