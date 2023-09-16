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
	<div class="product-wrap p-5 mb-5" style="border: 1px solid grey">
		<div class="product-list">
			<ul class="row">
				<li
					v-for="auction in auctions"
					:key="auction.id"
					class="col-lg-6 col-md-6 col-sm-12">
					<del v-if="auction.status == 1">
						<div class="product-box">
							<div class="producct-img">
								<img :src="auction.nft.image_uri" alt="" />
							</div>
							<div class="product-caption">
								<h4>
									<a href="#">{{ auction.nft.title }}</a>
								</h4>
								<div class="price w-100">
									{{ $t('bid.current_bid') }} :<ins
										>$
										{{
											new Intl.NumberFormat('fr').format(auction.current_bid)
										}}</ins
									>
								</div>
								<div class="price w-100">
									{{ $t('bid.start_price') }} :<ins
										>$
										{{
											new Intl.NumberFormat('fr').format(auction.start_price)
										}}</ins
									>
								</div>
								<div class="price">
									{{ $t('bid.paid') }} : {{ auction.is_paid ? 'Yes' : 'No' }}
								</div>
								<div
									class="price"
									v-if="!auction.is_paid && auction.winner_id == user.id">
									<router-link
										class="btn btn-outline-success"
										:to="`/profile/paiement/${auction.auction_uuid}`"
										>Payer</router-link
									>
								</div>
								<router-link
									class="btn btn-outline-primary"
									:to="`/auction/${auction.auction_uuid}`"
									>{{ $t('readmore') }}</router-link
								>
							</div>
						</div>
					</del>
					<div v-else class="product-box">
						<div class="producct-img">
							<img :src="auction.nft.image_uri" alt="" />
						</div>
						<div class="product-caption">
							<h4>
								<a href="#">{{ auction.nft.title }}</a>
							</h4>
							<div class="price">
								{{ $t('bid.current_bid') }} :<ins
									>$
									{{
										new Intl.NumberFormat('fr').format(auction.current_bid)
									}}</ins
								>
							</div>
							<div class="price">
								{{ $t('bid.start_price') }} :<ins
									>$
									{{
										new Intl.NumberFormat('fr').format(auction.start_price)
									}}</ins
								>
							</div>
							<router-link
								class="btn btn-outline-primary"
								:to="`/auction/${auction.auction_uuid}`"
								>{{ $t('readmore') }}</router-link
							>
						</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import { storeToRefs } from 'pinia';
	import { useAuthStore } from '../../stores/auth';
	export default {
		props: ['auctions', 'title'],

		data() {
			return {
				user: {},
			};
		},
		mounted() {
			const { me } = storeToRefs(useAuthStore());
			this.user = me.value;
		},
	};
</script>
