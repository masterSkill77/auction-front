<script setup>
	import { ref, watch } from 'vue';
	import { useLoadingStore } from '../../stores/loading';
	import { storeToRefs } from 'pinia';
	const { loading } = storeToRefs(useLoadingStore());
	setTimeout(() => useLoadingStore().setLoading(false), 3000);
</script>
<template>
	<div v-if="loading">
		<div class="pre-loader">
			<div class="pre-loader-box">
				<div class="loader-logo">
					<img src="/img/core-img/logo.png" alt="" />
				</div>
				<div class="loader-progress" id="progress_div">
					<div class="bar" id="bar1"></div>
				</div>
				<div class="percent" id="percent1">0%</div>
				<div class="loading-text">Loading...</div>
			</div>
		</div>
	</div>
</template>
