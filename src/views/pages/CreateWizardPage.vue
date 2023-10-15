<template>
	<section class="cryptos-about-area section-padding-0-0">
		<div class="container-fluid">
			<router-view />
		</div>
	</section>
</template>
<script setup>
	import { useLoadingStore } from '../../stores/loading';
	useLoadingStore().setLoading(true);
	setTimeout(() => {
		useLoadingStore().setLoading(false);
	}, 1500);
</script>
