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
					</tr>
				</thead>
				<tbody>
					<tr v-for="bid in allMyBids" :key="bid.id">
						<td></td>
						<td></td>
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
