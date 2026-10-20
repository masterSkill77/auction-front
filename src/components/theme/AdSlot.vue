<template>
	<router-link v-if="ad.enabled" :to="ad.to" class="ad-slot" :aria-label="`${ad.label} : ${ad.text}`">
		<span class="ad-slot__label">{{ ad.label }}</span>
		<span class="ad-slot__text">{{ ad.text }}</span>
		<span class="ad-slot__cta">{{ ad.cta }}</span>
	</router-link>
</template>

<script setup>
	import { HEADER_AD } from '@/config/ads';

	const ad = HEADER_AD;
</script>

<style scoped>
	.ad-slot {
		display: flex;
		align-items: center;
		gap: 10px;
		min-width: 0;
		height: 38px;
		padding: 0 6px 0 12px;
		border-radius: 999px;
		background: linear-gradient(90deg, rgba(255, 175, 2, 0.18), rgba(255, 175, 2, 0.06));
		border: 1px solid rgba(255, 175, 2, 0.35);
		color: #ffffff;
		text-decoration: none;
		font-size: 13px;
		transition: background 0.2s ease, border-color 0.2s ease;
	}

	.ad-slot:hover,
	.ad-slot:focus-visible {
		background: rgba(255, 175, 2, 0.26);
		border-color: #ffaf02;
		outline: none;
	}

	.ad-slot__label {
		flex-shrink: 0;
		padding: 2px 6px;
		border-radius: 4px;
		background: rgba(255, 255, 255, 0.12);
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: rgba(255, 255, 255, 0.7);
	}

	.ad-slot__text {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.ad-slot__cta {
		flex-shrink: 0;
		padding: 4px 12px;
		border-radius: 999px;
		background: #ffaf02;
		color: #0a0c24;
		font-weight: 600;
		font-size: 12px;
	}
</style>
