<script setup>
	import { ref, watch } from 'vue';
	import { useLoadingStore } from '../../stores/loading';
	import { storeToRefs } from 'pinia';
	const { loading } = storeToRefs(useLoadingStore());
	// setTimeout(() => useLoadingStore().setLoading(false), 3000);
</script>
<template>
	<div v-if="loading" class="lds-hourglass"></div>
</template>
<style scoped>
	.lds-hourglass {
		display: inline-block;
		position: fixed;
		z-index: 5147483650;
		background-color: #000000fa;
		width: 100%;
		height: 100vh;
	}
	.lds-hourglass:after {
		content: ' ';
		display: block;
		border-radius: 50%;
		width: 0;
		height: 0;
		position: absolute;
		top: 50%;
		left: 50%;
		margin: 8px;
		box-sizing: border-box;
		border: 32px solid #fff;
		border-color: #fff transparent #fff transparent;
		animation: lds-hourglass 1.2s infinite;
	}
	@keyframes lds-hourglass {
		0% {
			transform: rotate(0);
			animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
		}
		50% {
			transform: rotate(900deg);
			animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
		}
		100% {
			transform: rotate(1800deg);
		}
	}
</style>
