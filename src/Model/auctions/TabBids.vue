<script setup>
	import { useBidStore } from '@/stores/bid';
	const { title } = defineProps(['title']);
	const allMyBids = await useBidStore().getMyBids();
</script>
<template>
	<div class="card p-2">
		<div class="title">
			<h4>{{ title }}</h4>
		</div>
		<div class="table table-bids">
			<table class="w-100">
				<thead>
					<tr>
						<th>Auction</th>
						<th>Offre</th>
						<th>Paiement</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="bid in allMyBids" :key="bid.id">
						<td>
							<router-link
								class="btn btn-outline-primary btn-sm"
								:to="`/auction/${bid.auction.auction_uuid}`"
								>{{ bid.auction.auction_uuid }}</router-link
							>
						</td>
						<td>{{ new Intl.NumberFormat().format(bid.bid_amount) }}</td>
						<td>{{ bid.auction.payment }}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
<style>
	th,
	td {
		padding: 15px;
		text-align: left;
	}
</style>
