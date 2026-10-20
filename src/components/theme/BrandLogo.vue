<template>
	<span class="brand" :class="{ 'brand--inverse': inverse }">
		<svg class="brand__mark" viewBox="0 0 32 32" aria-hidden="true">
			<circle cx="16" cy="16" r="16" fill="#ffaf02" />
			<path d="M9 23 16 9l7 14h-3.4L16 15.8 12.4 23z" fill="#292929" />
		</svg>
		<span class="brand__name">Adebaka</span>
	</span>
</template>

<script setup>
	defineProps({
		inverse: { type: Boolean, default: false },
	});
</script>

<style scoped>
	.brand {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		text-decoration: none;
	}

	.brand__mark {
		width: 28px;
		height: 28px;
		flex-shrink: 0;
	}

	.brand__name {
		font-family: 'Montserrat', sans-serif;
		font-size: 20px;
		font-weight: 700;
		letter-spacing: 0.02em;
		color: #292929;
	}

	.brand--inverse .brand__name {
		color: #ffffff;
	}
</style>
